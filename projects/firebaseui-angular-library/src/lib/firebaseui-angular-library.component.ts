import {Component, Inject, OnDestroy, OnInit, EventEmitter, Output} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subscription} from 'rxjs';
import {CustomFirebaseUIAuthConfig, FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure} from './firebaseui-angular-library.helper';
import {User} from 'firebase/app';
import {FirebaseuiAngularLibraryService, DEFAULT_FIREBASE_UI_AUTH_CONTAINER} from './firebaseui-angular-library.service';
import 'firebase/auth';

@Component({
  selector: 'firebase-ui',
  template: '<div id="firebaseui-auth-container"></div>'
})
export class FirebaseuiAngularLibraryComponent implements OnInit, OnDestroy {

  @Output('signInSuccessWithAuthResult') signInSuccessWithAuthResultCallback: EventEmitter<FirebaseUISignInSuccessWithAuthResult> = new EventEmitter(); // tslint:disable-line
  @Output('signInFailure') signInFailureCallback: EventEmitter<FirebaseUISignInFailure> = new EventEmitter(); // tslint:disable-line

  private subscription: Subscription;

  constructor(private angularFireAuth: AngularFireAuth,
              @Inject('firebaseUIAuthConfig') private _firebaseUiConfig: CustomFirebaseUIAuthConfig,
              @Inject('firebaseUIAuthConfigFeature') private _firebaseUiConfig_Feature: CustomFirebaseUIAuthConfig,
              private firebaseUIService: FirebaseuiAngularLibraryService) {

    FirebaseuiAngularLibraryService.signInSuccessWithAuthResultCallback = this.signInSuccessWithAuthResultCallback;
    FirebaseuiAngularLibraryService.signInFailureCallback = this.signInFailureCallback;
  }

  get firebaseUiConfig(): CustomFirebaseUIAuthConfig {
    return {
      ...this._firebaseUiConfig,
      ...this._firebaseUiConfig_Feature
    } as CustomFirebaseUIAuthConfig;
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

  private async firebaseUIPopup() {
    await this.firebaseUIService.start(DEFAULT_FIREBASE_UI_AUTH_CONTAINER);
  }
  
}
