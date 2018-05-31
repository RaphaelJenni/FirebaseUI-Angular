/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

import * as firebaseui from 'firebaseui';
import AuthResult = firebaseui.auth.AuthResult;

export class FirebaseUIAuthConfig {
  providers: Array<AuthProvider | AuthProviderWithCustomConfig>;
  method?: AuthMethods;
  signInSuccessUrl?: string;
  tos?: string;
  credentialHelper?: CredentialHelper;
  autoUpgradeAnonymousUsers?: boolean;
}

export class FirebaseUISignInSuccess {
  authResult: AuthResult;
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
