import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from "firebase/app";
import { auth } from 'firebaseui';
import { DynamicLoaderService, Resource } from './dynamic-loader.service';
import { CustomFirebaseUIAuthConfig, FirebaseUILanguages } from './firebaseui-angular-library.helper';

declare const firebaseui: { auth: { AuthUI: any } };
declare const global: any;

@Injectable()
export class FirebaseuiAngularLibraryService {
  public static firebaseUiInstance: auth.AuthUI | undefined = undefined;

  constructor(
    @Inject('firebaseUIAuthConfig') private _firebaseUiConfig: CustomFirebaseUIAuthConfig,
    private _scriptLoaderService: DynamicLoaderService,
    private _angularFireAuth: AngularFireAuth) {

    // store the firebaseui instance in a static property to prevent double initialization
    if (!FirebaseuiAngularLibraryService.firebaseUiInstance) {
      // Set language based on the received configs
      this.setFirebaseUILanguage(this._firebaseUiConfig.language ?? "");
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

  async setFirebaseUILanguage(languageCode: string) {
    let instance: auth.AuthUI;

    // if the language has not been passed or if it's 'en', use the firebaseui version that ships with npm
    if (!languageCode || languageCode.toLowerCase() === "en") {
      instance = new auth.AuthUI(this._angularFireAuth.auth);
    } else {

      const languages = FirebaseUILanguages.filter((l) => l.code.toLowerCase() === languageCode.toLowerCase());

      if (languages.length !== 1) {
        throw new Error("Invalid language code");
      }

      // Otherwise we'll use a version of the same library from CDN.
      // Expose a reference to the firebase object or the firebaseui won't work
      if (typeof window !== "undefined") {
        window.firebase = firebase;
      }

      if (typeof global !== "undefined") {
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

      await this._scriptLoaderService.registerAndLoad(...toLoad);

      // and create a new firebaseui instance, using the imported firebaseui
      instance = new firebaseui.auth.AuthUI(this._angularFireAuth.auth);
    }

    // Set the static reference and resolve the Promise
    FirebaseuiAngularLibraryService.firebaseUiInstance = instance;
    return FirebaseuiAngularLibraryService.firebaseUiInstance;
  }

}
