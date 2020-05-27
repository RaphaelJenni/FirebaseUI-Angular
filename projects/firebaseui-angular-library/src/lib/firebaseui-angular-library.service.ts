import { EventEmitter, Inject, Injectable, NgZone, Optional } from '@angular/core';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, FirebaseApp, FirebaseAppConfig, FirebaseOptions, ɵfirebaseAppFactory } from '@angular/fire';
import * as firebaseui from 'firebaseui';
import { DynamicLoaderService, Resource } from './dynamic-loader.service';
import { ExtendedFirebaseUIAuthConfig, FirebaseUILanguages, FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, } from './firebaseui-angular-library.helper';

declare const global: any;

export const DEFAULT_FIREBASE_UI_AUTH_CONTAINER = "#firebaseui-auth-container";

@Injectable()
export class FirebaseuiAngularLibraryService {

  private static readonly COMPUTED_CALLBACKS = "COMPUTED_CALLBACKS";
  private static readonly FIREBASEUI_CDN_VERSION = "4.5.0";
  private static readonly FIREBASEUI_CDN_URL = `https://www.gstatic.com/firebasejs/ui/${FirebaseuiAngularLibraryService.FIREBASEUI_CDN_VERSION}`;

  public static firebaseUiInstance: firebaseui.auth.AuthUI | undefined = undefined;
  private static firstLoad = true;
  private static currentLanguageCode: string = "";

  public static signInSuccessWithAuthResultCallback: EventEmitter<FirebaseUISignInSuccessWithAuthResult> = new EventEmitter();
  public static signInFailureCallback: EventEmitter<FirebaseUISignInFailure> = new EventEmitter();

  private firebaseAppInstance: FirebaseApp;

  constructor(
    @Inject('firebaseUIAuthConfig') private _firebaseUiConfig: ExtendedFirebaseUIAuthConfig,
    private _scriptLoaderService: DynamicLoaderService,
    @Inject(FIREBASE_OPTIONS) options: FirebaseOptions,
    @Optional() @Inject(FIREBASE_APP_NAME) nameOrConfig: string | FirebaseAppConfig | null | undefined,
    private ngZone: NgZone) {

    // noinspection JSNonASCIINames
    this.firebaseAppInstance = ɵfirebaseAppFactory(options, this.ngZone, nameOrConfig);

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
  async getFirebaseUiInstance(pollingMs: number = 50): Promise<firebaseui.auth.AuthUI> {
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

    let instance: firebaseui.auth.AuthUI;
    const previousLanguageCode = FirebaseuiAngularLibraryService.currentLanguageCode;
    const previousLanguage = previousLanguageCode ? this.getLanguageByCode(previousLanguageCode) : null;

    FirebaseuiAngularLibraryService.currentLanguageCode = languageCode ? languageCode.toLowerCase() : "en";

    // if the language has not been passed or if it's 'en', use the firebaseui version that ships with npm, 
    // unless user has already changed language at least once. In this case the imported version from NPM would
    // be overwritten by the last version imported from the CDNs)
    if (!languageCode || (languageCode.toLowerCase() === "en" && FirebaseuiAngularLibraryService.firstLoad)) {
      instance = new firebaseui.auth.AuthUI(this.firebaseAppInstance.auth());
    } else {

      FirebaseuiAngularLibraryService.firstLoad = false;
      const languages = FirebaseUILanguages.filter((l) => l.code.toLowerCase() === languageCode.toLowerCase());

      if (languages.length !== 1) {
        throw new Error("Invalid language code");
      }

      // Otherwise we'll use a version of the same library from CDN.
      // Expose a reference to the firebase object or the firebaseui won't work
      if (typeof window !== "undefined" && typeof window.firebase === "undefined") {
        // Semi-cheat: firebaseAppInstance is an instance of FirebaseApp, 
        // but FirebaseUI uses an instance of the "vanilla" Firebase object (hence the cast to any and the "".firebase_" part)
        window.firebase = (this.firebaseAppInstance as any).firebase_;
      }

      if (typeof global !== "undefined" && typeof global["firebase"] === "undefined") {
        global["firebase"] = (this.firebaseAppInstance as any).firebase_;
      }

      const language = languages[0];
      const toLoad: Resource[] = [
        {
          name: `firebaseui-${language.code}`,
          type: "js",
          src: `${FirebaseuiAngularLibraryService.FIREBASEUI_CDN_URL}/firebase-ui-auth__${language.code}.js`
        }
      ];

      // If the selected language is a Right to Left one, load also the special css file
      if (language.isRtL) {
        toLoad.push({
          name: "firebaseui-css-rtl",
          type: "css",
          src: `${FirebaseuiAngularLibraryService.FIREBASEUI_CDN_URL}/firebase-ui-auth-rtl.css`
        });
      }

      // If we had previsouly loaded another language that was a RtL one and current one is not, 
      //    we need to load the LtR css
      if (previousLanguage && previousLanguage.isRtL && !language.isRtL) {
        toLoad.push({
          name: "firebaseui-css",
          type: "css",
          src: `${FirebaseuiAngularLibraryService.FIREBASEUI_CDN_URL}/firebase-ui-auth.css`
        });
      }

      await this._scriptLoaderService.registerAndLoad(...toLoad);

      // and create a new firebaseui instance, using the imported firebaseui
      instance = new firebaseui.auth.AuthUI(this.firebaseAppInstance.auth());
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

  private getLanguageByCode(code: string) {
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
