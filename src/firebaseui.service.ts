import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebaseui from 'firebaseui';

/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

@Injectable()
export class FirebaseUIService {
    public firebaseUiInstance: firebaseui.auth.AuthUI;

    constructor(@Inject(FirebaseApp) firebaseApp: any) {
        this.firebaseUiInstance = new firebaseui.auth.AuthUI(firebaseApp.auth());

    }
}
