import * as firebase from 'firebase/app';

/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

export class FirebaseUIAuthConfig {
    providers: Array<AuthProvider | AuthProviderWithCustomConfig>;
    method?: AuthMethods;
    signInSuccessUrl?: string;
    tos?: string;
    credentialHelper?: CredentialHelper;
}

export class FirebaseUISignInSuccess {
    currentUser: firebase.User;
    credential: firebase.auth.AuthCredential;
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