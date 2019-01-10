import {Component, EventEmitter, Inject, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subscription} from 'rxjs';
import {
  AuthMethods,
  AuthProvider,
  AuthProviderWithCustomConfig,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccess,
  FirebaseUISignInSuccessWithAuthResult,
  NativeFirebaseUIAuthConfig,
} from './firebaseui-angular-library.helper';
import * as firebaseui from 'firebaseui';
// noinspection ES6UnusedImports
import * as firebase from 'firebase/app';
import {User} from 'firebase/app';
import {FirebaseuiAngularLibraryService} from './firebaseui-angular-library.service';
import 'firebase/auth';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import TwitterAuthProvider = firebase.auth.TwitterAuthProvider;
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import PhoneAuthProvider = firebase.auth.PhoneAuthProvider;
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'firebase-ui',
  template: '<div id="firebaseui-auth-container"></div>'
})
export class FirebaseuiAngularLibraryComponent implements OnInit, OnDestroy {
  private static readonly COMPUTED_CALLBACKS = 'COMPUTED_CALLBACKS';

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
              @Inject('firebaseUIAuthConfig') private _firebaseUiConfig: NativeFirebaseUIAuthConfig | FirebaseUIAuthConfig,
              @Inject('firebaseUIAuthConfigFeature') private _firebaseUiConfig_Feature: NativeFirebaseUIAuthConfig | FirebaseUIAuthConfig,
              private ngZone: NgZone,
              private firebaseUIService: FirebaseuiAngularLibraryService) {
  }

  get firebaseUiConfig(): NativeFirebaseUIAuthConfig | FirebaseUIAuthConfig {
    return {
      ...this._firebaseUiConfig,
      ...this._firebaseUiConfig_Feature
    } as NativeFirebaseUIAuthConfig | FirebaseUIAuthConfig;
  }

  ngOnInit(): void {
    this.subscription = this.angularFireAuth.authState.subscribe((value: User) => {
      if ((value && value.isAnonymous) || !value) {
        if ((this.firebaseUiConfig as FirebaseUIAuthConfig).providers) {
          // tslint:disable-next-line
          console.warn(`"FirebaseUIAuthConfig" isn't supported since version 3.3.0 and will be removed in the future.\nPlease use the native configuration of firebaseui "firebaseui.auth.Config"`);
          console.warn('You can copy your converted configuration:\n', this.getNewConfigurationString(this.getUIAuthConfig()));

          if ((this.firebaseUiConfig as FirebaseUIAuthConfig).providers.length !== 0) {
            this.firebaseUIPopup();
          } else {
            throw new Error('There must be at least one AuthProvider.');
          }
        } else {
          if ((this.firebaseUiConfig as NativeFirebaseUIAuthConfig).signInOptions.length !== 0) {
            this.firebaseUIPopup();
          } else {
            throw new Error('There must be at least one AuthProvider.');
          }
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
    if (!(this.firebaseUiConfig as FirebaseUIAuthConfig).providers) {
      if (!(this.firebaseUiConfig as NativeFirebaseUIAuthConfig).callbacks) {
        this.firebaseUiConfig[FirebaseuiAngularLibraryComponent.COMPUTED_CALLBACKS] = true;
        (this.firebaseUiConfig as NativeFirebaseUIAuthConfig).callbacks = this.getCallbacks();
      }
      return (this.firebaseUiConfig as NativeFirebaseUIAuthConfig);
    }

    const authConfig: FirebaseUIAuthConfig = (this.firebaseUiConfig as FirebaseUIAuthConfig);

    const authProviders: Array<any> = [];
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
    const privacyPolicyUrl = authConfig.privacyPolicyUrl ? authConfig.privacyPolicyUrl : '';

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
      this.ngZone.run(() => {
        this.signInSuccessCallback.emit({
          currentUser,
          credential,
          redirectUrl
        });
      });
      return !!authConfig.signInSuccessUrl;
    };

    const callbacks: any = {
      ...this.getCallbacks(),
      signInSuccess: null
    };

    if (!authConfig.disableSignInSuccessCallback) {
      console.warn('[FirebaseUiAngular] signInSuccess callback is deprecated. Please use signInSuccessWithAuthResult callback instead.\n' +
        'To remove this warning set disableSignInSuccessCallback on the FirebaseUiConfig Object.');
      callbacks.signInSuccess = signInSuccessCallback;
    }

    const nativeConfiguration: NativeFirebaseUIAuthConfig = {
      callbacks: callbacks,
      signInFlow: authMethod,
      signInOptions: authProviders,
      tosUrl: tosURL,
      privacyPolicyUrl: privacyPolicyUrl,
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
      (this.firebaseUiConfig as NativeFirebaseUIAuthConfig).callbacks = null;
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

  private getNewConfigurationString(configuration: NativeFirebaseUIAuthConfig): string {
    delete configuration.callbacks;

    if (!configuration.autoUpgradeAnonymousUsers) {
      delete configuration.autoUpgradeAnonymousUsers;
    }

    let stringifiedConfiguration = JSON.stringify(configuration, null, 2);
    /* tslint:disable */
    stringifiedConfiguration = stringifiedConfiguration.replace('"credentialHelper": "accountchooser.com"', '"credentialHelper": firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM');
    stringifiedConfiguration = stringifiedConfiguration.replace('"credentialHelper": "googleyolo"', '"credentialHelper": firebaseui.auth.CredentialHelper.GOOGLE_YOLO');
    stringifiedConfiguration = stringifiedConfiguration.replace('"credentialHelper": "none"', '"credentialHelper": firebaseui.auth.CredentialHelper.NONE');

    stringifiedConfiguration = stringifiedConfiguration.replace('"provider": "google.com"', '"provider": firebase.auth.GoogleAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"provider": "facebook.com"', '"provider": firebase.auth.FacebookAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"provider": "twitter.com"', '"provider": firebase.auth.TwitterAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"provider": "github.com"', '"provider": firebase.auth.GithubAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"provider": "password"', '"provider": firebase.auth.EmailAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"provider": "phone"', '"provider": firebase.auth.PhoneAuthProvider.PROVIDER_ID');

    stringifiedConfiguration = stringifiedConfiguration.replace('"google.com"', 'firebase.auth.GoogleAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"facebook.com"', 'firebase.auth.FacebookAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"twitter.com"', 'firebase.auth.TwitterAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"github.com"', 'firebase.auth.TwitterAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"password"', 'firebase.auth.EmailAuthProvider.PROVIDER_ID');
    stringifiedConfiguration = stringifiedConfiguration.replace('"phone"', 'firebase.auth.PhoneAuthProvider.PROVIDER_ID');

    stringifiedConfiguration = stringifiedConfiguration.replace(/"([a-zA-Z0-9]*)": (.*)/g, '$1: $2');
    stringifiedConfiguration = stringifiedConfiguration.replace(/"/g, '\'');
    /* tslint:enable */
    return stringifiedConfiguration;
  }
}
