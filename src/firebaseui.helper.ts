import * as firebase from 'firebase/app';

/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

export class FirebaseUIAuthConfig {
    providers: Array<AuthProvider | AuthProviderWithCustomConfig | AuthProviders>;
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
    AccountChooser, None
}

export enum AuthProvider {
    Google, Facebook, Twitter, Github, Password, Phone
}


/**
 * @deprecated Because of bad naming, this will be removed in 0.6.0. Use AuthProvider instead.
 */
export enum AuthProviders {
    Google, Facebook, Twitter, Github, Password, Phone
}


export interface AuthProviderWithCustomConfig {
    provider: AuthProvider;
    customConfig: Object;
}

export enum AuthMethods {
    Popup, Redirect
}