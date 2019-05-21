import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebaseui from 'firebaseui';

@Injectable()
export class FirebaseuiAngularLibraryService {
  public firebaseUiInstance: firebaseui.auth.AuthUI;

  constructor(angularFireAuth: AngularFireAuth) {
    // store the firebaseui instance on the window object to prevent double initialization
    if (!(<any>window).firebaseUiInstance) {
      (<any>window).firebaseUiInstance = new firebaseui.auth.AuthUI(angularFireAuth.auth);
    }
    this.firebaseUiInstance = (<any>window).firebaseUiInstance as firebaseui.auth.AuthUI;
  }
}
