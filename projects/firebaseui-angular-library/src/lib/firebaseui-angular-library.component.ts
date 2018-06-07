import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {
  AuthMethods,
  AuthProvider,
  AuthProviderWithCustomConfig,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccess,
  FirebaseUISignInSuccessWithAuthResult
} from './firebaseui-angular-library.helper';
import * as firebaseui from 'firebaseui';
import {AngularFireAuth} from 'angularfire2/auth';
import { User } from 'firebase/app';
import {FirebaseuiAngularLibraryService} from './firebaseui-angular-library.service';
// noinspection ES6UnusedImports
import * as firebase from 'firebase/app';
import 'firebase/auth';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import TwitterAuthProvider = firebase.auth.TwitterAuthProvider;
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import PhoneAuthProvider = firebase.auth.PhoneAuthProvider;

@Component({
  selector: 'firebase-ui',
  template: `
    <div id="firebaseui-auth-container"></div>`
})
export class FirebaseuiAngularLibraryComponent implements OnInit, OnDestroy {

  /**
   * @deprecated Use signInSuccessWithAuthResult
   */
  @Output('signInSuccess') signInSuccessCallback: EventEmitter<FirebaseUISignInSuccess> = new EventEmitter(); // tslint:disable-line

  @Output('signInSuccessWithAuthResult') signInSuccessWithAuthResultCallback: EventEmitter<FirebaseUISignInSuccessWithAuthResult> = new EventEmitter(); // tslint:disable-line
  @Output('signInFailure') signInFailureCallback: EventEmitter<FirebaseUISignInFailure> = new EventEmitter(); // tslint:disable-line

  private subscription: Subscription;

  private static getAuthProvider(provider: AuthProvider): string {
    switch (provider) {
      case AuthProvider.Google:
        return GoogleAuthProvider.PROVIDER_ID;
      case AuthProvider.Facebook:
        return FacebookAuthProvider.PROVIDER_ID;
      case AuthProvider.Twitter:
        return TwitterAuthProvider.PROVIDER_ID;
      case AuthProvider.Github:
        return GithubAuthProvider.PROVIDER_ID;
      case AuthProvider.Password:
        return EmailAuthProvider.PROVIDER_ID;
      case AuthProvider.Phone:
        return PhoneAuthProvider.PROVIDER_ID;
    }
  }

  constructor(private angularFireAuth: AngularFireAuth,
              private firebaseUiConfig: FirebaseUIAuthConfig,
              private firebaseUIService: FirebaseuiAngularLibraryService) {
  }

  ngOnInit(): void {
    this.subscription = this.angularFireAuth.authState.subscribe((value: User) => {
      if ((value && value.isAnonymous) || !value) {
        if (this.firebaseUiConfig.providers.length !== 0) {
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

  private getUIAuthConfig(authConfig: FirebaseUIAuthConfig): Object {
    const authProviders: Array<Object> = [];
    for (let provider of authConfig.providers) {
      if (!!(provider as AuthProviderWithCustomConfig).customConfig) {
        provider = (provider as AuthProviderWithCustomConfig);

        const providerWithConfig = provider.customConfig;
        providerWithConfig['provider'] = FirebaseuiAngularLibraryComponent.getAuthProvider(provider.provider);

        authProviders.push(providerWithConfig);
      } else {
        authProviders.push(FirebaseuiAngularLibraryComponent.getAuthProvider(provider as AuthProvider));
      }
    }

    const tosURL = authConfig.tos ? authConfig.tos : '';

    let authMethod = 'popup';
    switch (authConfig.method) {
      case AuthMethods.Redirect:
        authMethod = 'redirect';
        break;
      case null:
      case AuthMethods.Popup:
      default:
        break;
    }

    let credentialHelper;
    switch (authConfig.credentialHelper) {
      case CredentialHelper.None:
        credentialHelper = firebaseui.auth.CredentialHelper.NONE;
        break;
      case CredentialHelper.OneTap:
        credentialHelper = firebaseui.auth.CredentialHelper.GOOGLE_YOLO;
        break;
      case CredentialHelper.AccountChooser:
      default:
        credentialHelper = firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM;
        break;
    }

    const autoUpgradeAnonymousUsers = authConfig.autoUpgradeAnonymousUsers == null ? false : authConfig.autoUpgradeAnonymousUsers;

    const signInSuccessCallback = (currentUser: firebase.User, credential: firebase.auth.AuthCredential, redirectUrl: string) => {
      this.signInSuccessCallback.emit({
        currentUser,
        credential,
        redirectUrl
      });
      return !!authConfig.signInSuccessUrl;
    };

    const signInSuccessWithAuthResult = (authResult: firebaseui.auth.AuthResult, redirectUrl) => {
      this.signInSuccessWithAuthResultCallback.emit({
        authResult,
        redirectUrl
      });
      return !!authConfig.signInSuccessUrl;
    };

    const signInFailureCallback = (error: firebaseui.auth.AuthUIError) => {
      this.signInFailureCallback.emit({
        code: error.code,
        credential: error.credential
      });
    };

    const callbacks = {
      signInSuccessWithAuthResult: signInSuccessWithAuthResult,
      signInFailure: signInFailureCallback,
      signInSuccess: null
    };

    if (!authConfig.disableSignInSuccessCallback) {
      console.warn('[FirebaseUiAngular] signInSuccess callback is deprecated. Please use signInSuccessWithAuthResult callback instead.\n' +
        'To remove this warning set disableSignInSuccessCallback on the FirebaseUiConfig Object.');
      callbacks.signInSuccess = signInSuccessCallback;
    }

    const nativeConfiguration: FirebaseUINativeConfiguration = {
      callbacks: callbacks,
      signInFlow: authMethod,
      signInOptions: authProviders,
      tosUrl: tosURL,
      credentialHelper: credentialHelper,
      autoUpgradeAnonymousUsers: autoUpgradeAnonymousUsers
    };
    if (!!authConfig.signInSuccessUrl) {
      nativeConfiguration.signInSuccessUrl = authConfig.signInSuccessUrl;
    }
    return nativeConfiguration;
  }

  private firebaseUIPopup() {
    const firebaseUiInstance = this.firebaseUIService.firebaseUiInstance;
    firebaseUiInstance.start('#firebaseui-auth-container', this.getUIAuthConfig(this.firebaseUiConfig));
  }
}

interface FirebaseUINativeConfiguration {
  callbacks?: any;
  credentialHelper?: any;
  queryParameterForSignInSuccessUrl?: string;
  queryParameterForWidgetMode?: string;
  signInFlow?: string;
  signInOptions?: any;
  signInSuccessUrl?: string;
  autoUpgradeAnonymousUsers?: boolean;
  tosUrl: string;
}
