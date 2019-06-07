import {Component, EventEmitter, Inject, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subscription} from 'rxjs';
import {
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
  NativeFirebaseUIAuthConfig,
} from './firebaseui-angular-library.helper';
import * as firebaseui from 'firebaseui';
import {User} from 'firebase/app';
import {FirebaseuiAngularLibraryService} from './firebaseui-angular-library.service';
import 'firebase/auth';
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'firebase-ui',
  template: '<div id="firebaseui-auth-container"></div>'
})
export class FirebaseuiAngularLibraryComponent implements OnInit, OnDestroy {
  private static readonly COMPUTED_CALLBACKS = 'COMPUTED_CALLBACKS';

  @Output('signInSuccessWithAuthResult') signInSuccessWithAuthResultCallback: EventEmitter<FirebaseUISignInSuccessWithAuthResult> = new EventEmitter(); // tslint:disable-line
  @Output('signInFailure') signInFailureCallback: EventEmitter<FirebaseUISignInFailure> = new EventEmitter(); // tslint:disable-line

  private subscription: Subscription;

  constructor(private angularFireAuth: AngularFireAuth,
              @Inject('firebaseUIAuthConfig') private _firebaseUiConfig: NativeFirebaseUIAuthConfig,
              @Inject('firebaseUIAuthConfigFeature') private _firebaseUiConfig_Feature: NativeFirebaseUIAuthConfig,
              private ngZone: NgZone,
              private firebaseUIService: FirebaseuiAngularLibraryService) {
  }

  get firebaseUiConfig(): NativeFirebaseUIAuthConfig {
    return {
      ...this._firebaseUiConfig,
      ...this._firebaseUiConfig_Feature
    } as NativeFirebaseUIAuthConfig;
  }

  ngOnInit(): void {
    this.subscription = this.angularFireAuth.authState.subscribe((value: User) => {
      if ((value && value.isAnonymous) || !value) {
        if (this.firebaseUiConfig.signInOptions.length !== 0) {
          this.firebaseUIPopup();
        } else {
          throw new Error('There must be at least one AuthProvider.');
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getUIAuthConfig(): NativeFirebaseUIAuthConfig {
    if (!(this.firebaseUiConfig as NativeFirebaseUIAuthConfig).callbacks) {
      this._firebaseUiConfig[FirebaseuiAngularLibraryComponent.COMPUTED_CALLBACKS] = true;
      (this._firebaseUiConfig as NativeFirebaseUIAuthConfig).callbacks = this.getCallbacks();
    }
    return (this.firebaseUiConfig as NativeFirebaseUIAuthConfig);
  }

  private firebaseUIPopup() {
    const firebaseUiInstance = this.firebaseUIService.firebaseUiInstance;
    const uiAuthConfig = this.getUIAuthConfig();

    // Check if callbacks got computed to reset them again after providing the to firebaseui.
    // Necessary for allowing updating the firebaseui config during runtime.
    let resetCallbacks = false;
    if (uiAuthConfig[FirebaseuiAngularLibraryComponent.COMPUTED_CALLBACKS]) {
      resetCallbacks = true;
      delete uiAuthConfig[FirebaseuiAngularLibraryComponent.COMPUTED_CALLBACKS];
    }

    // show the firebaseui
    firebaseUiInstance.start('#firebaseui-auth-container', uiAuthConfig);

    if (resetCallbacks) {
      (this._firebaseUiConfig as NativeFirebaseUIAuthConfig).callbacks = null;
    }
  }

  private getCallbacks(): any {
    const signInSuccessWithAuthResult = (authResult: UserCredential, redirectUrl) => {
      this.ngZone.run(() => {
        this.signInSuccessWithAuthResultCallback.emit({
          authResult,
          redirectUrl
        });
      });
      return this.firebaseUiConfig.signInSuccessUrl;
    };

    const signInFailureCallback = (error: firebaseui.auth.AuthUIError) => {
      this.ngZone.run(() => {
        this.signInFailureCallback.emit({
          code: error.code,
          credential: error.credential
        });
      });
      return Promise.reject();
    };

    return {
      signInSuccessWithAuthResult: signInSuccessWithAuthResult,
      signInFailure: signInFailureCallback,
    };
  }
}
