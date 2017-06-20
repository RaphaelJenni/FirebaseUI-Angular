import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseUIService } from './firebaseui.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';

/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

export class FirebaseUIAuthConfig {
    providers: AuthProviders[] | Object[];
    method?: AuthMethods;
    signInSuccessUrl?: string;
    tos?: string;
}

export enum AuthProviders {
    Google, Facebook, Twitter, Github, Password, Phone
}

export enum AuthMethods {
    Popup, Redirect
}

@Component({
    selector: 'firebase-ui',
    template: `
        <div id="firebaseui-auth-container"></div>`
})
export class FirebaseUIComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    private static getUIAuthConfig(authConfig: FirebaseUIAuthConfig): Object {
        let authProviders: Array<Object> = [];
        for (let provider of authConfig.providers) {
            switch (provider) {
                case AuthProviders.Google:
                    authProviders.push(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
                    break;
                case AuthProviders.Facebook:
                    authProviders.push(firebase.auth.FacebookAuthProvider.PROVIDER_ID);
                    break;
                case AuthProviders.Twitter:
                    authProviders.push(firebase.auth.TwitterAuthProvider.PROVIDER_ID);
                    break;
                case AuthProviders.Github:
                    authProviders.push(firebase.auth.GithubAuthProvider.PROVIDER_ID);
                    break;
                case AuthProviders.Password:
                    authProviders.push(firebase.auth.EmailAuthProvider.PROVIDER_ID);
                    break;
                case AuthProviders.Phone:
                    authProviders.push(firebase.auth.PhoneAuthProvider.PROVIDER_ID);
                    break;
                default:
                    authProviders.push(authProviders);
            }
        }

        let tosURL = authConfig.tos ? authConfig.tos : '';

        let authMethod = 'popup';
        switch (authConfig.method) {
            case null:
            case AuthMethods.Popup:
                break;
            case AuthMethods.Redirect:
                authMethod = 'redirect';
                break;
            default:
                throw new Error(`Unknown auth method. Valid: [AuthMethods.Popup, AuthMethods.Redirect]`);
        }

        return {
            callbacks: {
                signInSuccess: () => false
            },
            signInFlow: authMethod,
            signInOptions: authProviders,
            tosUrl: tosURL
        };
    }

    constructor(private angularFireAuth: AngularFireAuth,
                private firebaseUiConfig: FirebaseUIAuthConfig,
                private firebaseUIService: FirebaseUIService) {
    }

    ngOnInit(): void {
        this.subscription = this.angularFireAuth.authState.subscribe(value => {
            if (!value) {
                if (this.firebaseUiConfig.providers.length !== 0) {
                    this.firebaseUIPopup();
                } else {
                    throw new Error('There must be at least one AuthProvider.');
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private firebaseUIPopup() {
        let firebaseUiInstance = this.firebaseUIService.firebaseUiInstance;
        firebaseUiInstance.start('#firebaseui-auth-container', FirebaseUIComponent.getUIAuthConfig(this.firebaseUiConfig));
    }
}
