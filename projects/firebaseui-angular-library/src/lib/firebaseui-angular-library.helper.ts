/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

import * as firebaseuiOriginal from 'firebaseui';
import firebaseOriginal from 'firebase/compat/app';
import UserCredential = firebaseOriginal.auth.UserCredential;
import AuthCredential = firebaseOriginal.auth.AuthCredential;

export const firebase = firebaseOriginal;
export const firebaseui = firebaseuiOriginal;

export type NativeFirebaseUIAuthConfig = firebaseuiOriginal.auth.Config;


export class FirebaseUISignInSuccessWithAuthResult {
  authResult: UserCredential;
  redirectUrl: string;
}

export class FirebaseUISignInFailure {
  code: string;
  credential: AuthCredential;
}
