/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

import * as firebaseOriginal from 'firebase/app';
import UserCredential = firebase.auth.UserCredential;
import * as firebaseuiOriginal from 'firebaseui';

export const firebase = firebaseOriginal;
export const firebaseui = firebaseuiOriginal;

/**
 * @deprecated Please use native configuration of firebaseui (firebaseui.auth.Config)
 */
export class FirebaseUIAuthConfig {
  providers: Array<AuthProvider | AuthProviderWithCustomConfig>;
  method?: AuthMethods;
  signInSuccessUrl?: string;
  tos?: string;
  privacyPolicyUrl?: string;
  credentialHelper?: CredentialHelper;
  autoUpgradeAnonymousUsers?: boolean;

  /**
   * Will be default in the future
   */
  disableSignInSuccessCallback?: boolean;
}

export type NativeFirebaseUIAuthConfig = firebaseuiOriginal.auth.Config;


export class FirebaseUISignInSuccessWithAuthResult {
  authResult: UserCredential;
  redirectUrl: string;
}

export class FirebaseUISignInFailure {
  code: string;
  credential: firebaseOriginal.auth.AuthCredential;
}

/**
 * @deprecated Use {@link FirebaseUISignInSuccessWithAuthResult}
 */
export class FirebaseUISignInSuccess {
  currentUser: firebaseOriginal.User;
  credential: firebaseOriginal.auth.AuthCredential;
  redirectUrl: string;
}


export enum CredentialHelper {
  AccountChooser, OneTap, None
}

export enum AuthProvider {
  Google, Facebook, Twitter, Github, Password, Phone
}

export interface AuthProviderWithCustomConfig {
  provider: AuthProvider;
  customConfig: Object;
}

export enum AuthMethods {
  Popup, Redirect
}
