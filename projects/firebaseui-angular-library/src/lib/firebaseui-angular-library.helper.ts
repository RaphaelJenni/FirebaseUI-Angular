/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

import * as firebaseOriginal from 'firebase/app';
import UserCredential = firebase.auth.UserCredential;
import * as firebaseuiOriginal from 'firebaseui';

export const firebase = firebaseOriginal;
export const firebaseui = firebaseuiOriginal;

export type NativeFirebaseUIAuthConfig = firebaseuiOriginal.auth.Config;
export type CustomFirebaseUIAuthConfig = firebaseuiOriginal.auth.Config & {
  language?: string
};

export class FirebaseUISignInSuccessWithAuthResult {
  authResult: UserCredential;
  redirectUrl: string;
}

export class FirebaseUISignInFailure {
  code: string;
  credential: firebaseOriginal.auth.AuthCredential;
}

export interface FirebaseUILanguage {
  code: string;
  name?: string;
  isRtL?: boolean;
}

export const FirebaseUILanguages: FirebaseUILanguage[] = [
  { code: "ar", name: "Arabic", isRtL: true },
  { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" },
  { code: "zh_cn", name: "Chinese (Simplified)" },
  { code: "zh_tw", name: "Chinese (Traditional)" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "en_gb", name: "English (UK)" },
  { code: "fa", name: "Farsi", isRtL: true },
  { code: "fil", name: "Filipino" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "iw", name: "Hebrew", isRtL: true },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "no", name: "Norwegian (Bokmal)" },
  { code: "pl", name: "Polish" },
  { code: "pt_br", name: "Portuguese (Brazil)" },
  { code: "pt_pt", name: "Portuguese (Portugal)" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sr", name: "Serbian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "es", name: "Spanish" },
  { code: "es_419", name: "Spanish (Latin America)" },
  { code: "sv", name: "Swedish" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" }
];
