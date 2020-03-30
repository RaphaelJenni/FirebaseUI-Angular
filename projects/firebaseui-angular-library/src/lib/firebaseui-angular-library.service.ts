import { EventEmitter, Inject, Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from "firebase/app";
import { auth } from 'firebaseui';
import { DynamicLoaderService, Resource } from './dynamic-loader.service';
import { ExtendedFirebaseUIAuthConfig, FirebaseUILanguages, FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from './firebaseui-angular-library.helper';

declare const firebaseui: { auth: { AuthUI: any } };
declare const global: any;

export const DEFAULT_FIREBASE_UI_AUTH_CONTAINER = "#firebaseui-auth-container";

@Injectable()
export class FirebaseuiAngularLibraryService {

  private static readonly COMPUTED_CALLBACKS = "COMPUTED_CALLBACKS";

  public static firebaseUiInstance: auth.AuthUI | undefined = undefined;
  private static firstLoad = true;
  private static currentLanguageCode: string = "";

  public static signInSuccessWithAuthResultCallback: EventEmitter<FirebaseUISignInSuccessWithAuthResult> = new EventEmitter();
  public static signInFailureCallback: EventEmitter<FirebaseUISignInFailure> = new EventEmitter();

  constructor(
    @Inject('firebaseUIAuthConfig') private _firebaseUiConfig: ExtendedFirebaseUIAuthConfig,
    private _scriptLoaderService: DynamicLoaderService,
    private ngZone: NgZone,
    private _angularFireAuth: AngularFireAuth) {

    // store the firebaseui instance in a static property to prevent double initialization
    if (!FirebaseuiAngularLibraryService.firebaseUiInstance) {
      // Set language based on the received configs but don't show it yet. It will be shown by the firebaseui-angular-library.component.ts
      this.setFirebaseUILanguage(this._firebaseUiConfig.language ?? "", null);
    }
  }

  /**
   * This method returns the firebaseui instance once it's available.
   * @param pollingMs Number of milliseconds to wait before each check to see if instance is available
   */
  async getFirebaseUiInstance(pollingMs: number = 50): Promise<auth.AuthUI> {
    return await new Promise((resolve) => {

      // Each "pollingMs" this method will check if the firebaseUiInstance has been defined
      const interval = setInterval(() => {

        // If so, clear the interval and resolve the Promise, otherwise keep polling
        if (FirebaseuiAngularLibraryService.firebaseUiInstance) {
          clearInterval(interval);
          return resolve(FirebaseuiAngularLibraryService.firebaseUiInstance);
        }

      }, pollingMs);
    });
  }

  /**
   * Changes the current language of the FirebaseUI panel
   * @param languageCode Code of the language to load (e.g.: 'en', 'es', 'it', ...)
   * @param element Optional. Container element
   */
  async setFirebaseUILanguage(languageCode: string, element: string | Element = DEFAULT_FIREBASE_UI_AUTH_CONTAINER) {
    // If an instance is already available, delete it. This prevents double initialization errors.
    const currentInstance = FirebaseuiAngularLibraryService.firebaseUiInstance;
    if (currentInstance) {
      await currentInstance.delete();
    }

    let instance: auth.AuthUI;
    const previousLanguageCode = FirebaseuiAngularLibraryService.currentLanguageCode;
    const previousLanguage = previousLanguageCode? this.getLanguageByCode(previousLanguageCode) :null;

    FirebaseuiAngularLibraryService.currentLanguageCode = languageCode ? languageCode.toLowerCase() : "en";

    // if the language has not been passed or if it's 'en', use the firebaseui version that ships with npm, 
    // unless user has already changed language at least once. In this case the imported version from NPM would
    // be overwritten by the last version imported from the CDNs)
    if (!languageCode || (languageCode.toLowerCase() === "en" && FirebaseuiAngularLibraryService.firstLoad)) {
      instance = new auth.AuthUI(this._angularFireAuth.auth);
    } else {

      FirebaseuiAngularLibraryService.firstLoad = false;
      const languages = FirebaseUILanguages.filter((l) => l.code.toLowerCase() === languageCode.toLowerCase());

      if (languages.length !== 1) {
        throw new Error("Invalid language code");
      }

      // Otherwise we'll use a version of the same library from CDN.
      // Expose a reference to the firebase object or the firebaseui won't work
      if (typeof window !== "undefined" && typeof window.firebase === "undefined") {
        window.firebase = firebase;
      }

      if (typeof global !== "undefined" && typeof global["firebase"] === "undefined") {
        global["firebase"] = firebase;
      }

      const language = languages[0];
      const toLoad: Resource[] = [
        {
          name: `firebaseui-${language.code}`,
          type: "js",
          src: `https://www.gstatic.com/firebasejs/ui/4.5.0/firebase-ui-auth__${language.code}.js`
        }
      ];

      // If the selected language is a Right to Left one, load also the special css file
      if (language.isRtL) {
        toLoad.push({
          name: "firebaseui-css-rtl",
          type: "css",
          src: "https://www.gstatic.com/firebasejs/ui/4.5.0/firebase-ui-auth-rtl.css"
        });
      }

      // If we had previsouly loaded another language that was a RtL one and current one is not, 
      //    we need to load the LtR css
      if (previousLanguage && previousLanguage.isRtL && !language.isRtL) {
        toLoad.push({
          name: "firebaseui-css",
          type: "css",
          src: "https://www.gstatic.com/firebasejs/ui/4.5.0/firebase-ui-auth.css"
        });
      }

      await this._scriptLoaderService.registerAndLoad(...toLoad);

      // and create a new firebaseui instance, using the imported firebaseui
      instance = new firebaseui.auth.AuthUI(this._angularFireAuth.auth);
    }

    // Set the static reference and resolve the Promise
    FirebaseuiAngularLibraryService.firebaseUiInstance = instance;

    if (element) {
      // Start the UI
      await this.start(element);
    }

    return FirebaseuiAngularLibraryService.firebaseUiInstance;
  }

  /**
   * Shows FirebaseUI
   * @param element A container element
   */
  async start(element: string | Element) {
    const instance = await this.getFirebaseUiInstance();
    const config = this.getUIAuthConfig();

    // Check if callbacks got computed to reset them again after providing the to firebaseui.
    // Necessary for allowing updating the firebaseui config during runtime.
    let resetCallbacks = false;

    if (config[FirebaseuiAngularLibraryService.COMPUTED_CALLBACKS]) {
      resetCallbacks = true;
      delete config[FirebaseuiAngularLibraryService.COMPUTED_CALLBACKS];
    }

    delete config["language"];

    instance.start(element, config);

    if (resetCallbacks) {
      this._firebaseUiConfig.callbacks = null;
    }
  }

  /**
   * Returns the currently selected language, as an instance of FirebaseUILanguage.
   * It could return null if the current language can't be parsed.
   */
  getCurrentLanguage() {
    return this.getLanguageByCode(FirebaseuiAngularLibraryService.currentLanguageCode);
  }

  private getLanguageByCode(code: string){
    const matching = FirebaseUILanguages.filter((lang) => lang.code.toLowerCase() === code.toLowerCase());

    if (matching.length === 1) {
      return matching[0];
    }

    return null;
  }

  private getUIAuthConfig(): ExtendedFirebaseUIAuthConfig {
    if (!this._firebaseUiConfig.callbacks) {
      this._firebaseUiConfig[FirebaseuiAngularLibraryService.COMPUTED_CALLBACKS] = true;
      this._firebaseUiConfig.callbacks = this.getCallbacks();
    }
    return this._firebaseUiConfig;
  }

  private getCallbacks(): any {

    const signInSuccessWithAuthResult = (authResult: firebase.auth.UserCredential, redirectUrl: string) => {
      this.ngZone.run(() => {
        FirebaseuiAngularLibraryService.signInSuccessWithAuthResultCallback.emit({
          authResult,
          redirectUrl
        });
      });
      return this._firebaseUiConfig.signInSuccessUrl;
    };

    const signInFailureCallbackResult = (error: firebaseui.auth.AuthUIError) => {
      this.ngZone.run(() => {
        FirebaseuiAngularLibraryService.signInFailureCallback.emit({
          code: error.code,
          credential: error.credential
        });
      });
      return Promise.reject();
    };

    return {
      signInSuccessWithAuthResult: signInSuccessWithAuthResult,
      signInFailure: signInFailureCallbackResult,
    };
  }

}
