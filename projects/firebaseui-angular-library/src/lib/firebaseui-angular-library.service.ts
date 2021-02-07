import { Inject, Injectable, InjectionToken, NgZone, Optional } from '@angular/core';
import * as firebaseui from 'firebaseui';
import {FIREBASE_APP_NAME, FIREBASE_OPTIONS, FirebaseApp, FirebaseAppConfig, FirebaseOptions, ɵfirebaseAppFactory} from '@angular/fire';
import _firebase from 'firebase/app';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';

type UseEmulatorArguments = [string, number];

@Injectable()
export class FirebaseuiAngularLibraryService {
  public firebaseUiInstance: firebaseui.auth.AuthUI;

  constructor(@Inject(FIREBASE_OPTIONS) options: FirebaseOptions,
              @Optional() @Inject(FIREBASE_APP_NAME) nameOrConfig: string | FirebaseAppConfig | null | undefined,
              @Optional() @Inject(USE_AUTH_EMULATOR) _useEmulator: any, // can't use the tuple here
              zone: NgZone) {
    // noinspection JSNonASCIINames
    const app: FirebaseApp = ɵfirebaseAppFactory(options, zone, nameOrConfig);
    // store the firebaseui instance on the window object to prevent double initialization

    const useEmulator: UseEmulatorArguments | null = _useEmulator;

    if (!(<any>window).firebaseUiInstance) {
      const auth: _firebase.auth.Auth = app.auth();
      if (useEmulator) {
        auth.useEmulator(`http://${useEmulator.join(':')}`);
      }
      (<any>window).firebaseUiInstance = new firebaseui.auth.AuthUI(auth);
    }
    this.firebaseUiInstance = (<any>window).firebaseUiInstance as firebaseui.auth.AuthUI;
  }
}
