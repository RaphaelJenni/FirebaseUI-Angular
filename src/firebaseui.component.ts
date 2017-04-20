import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import * as firebase from 'firebase/app';
import { FirebaseUIService } from './firebaseui.service';

/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

export class FirebaseUIAuthConfig {
    providers: AuthProviders[];
    method?: AuthMethods;
    tos?: string;
}

@Component({
    selector: 'firebase-ui',
    template: `
        <div id="firebaseui-auth-container"></div>`
})
export class FirebaseUIComponent implements OnInit {

    private static getUIAuthConfig(authConfig: FirebaseUIAuthConfig): Object {
        let authProviders: Array<string> = [];
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
                default:
                    throw new Error(`Unknown auth provider "${provider}". Valid: [google, facebook, twitter, github, email]`);
            }
        }

        let tosURL = authConfig.tos ? authConfig.tos : '';

        let authMethod: string;
        switch (authConfig.method) {
            case null:
            case AuthMethods.Popup:
                authMethod = 'popup';
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

    constructor(private angularFire: AngularFire,
                private firebaseUiConfig: FirebaseUIAuthConfig,
                private firebaseUIService: FirebaseUIService) {
    }

    ngOnInit(): void {
        this.angularFire.auth.take(1).subscribe(value => {
            if (!value) {
                if (this.firebaseUiConfig.providers.length !== 0) {
                    this.firebaseUIPopup();
                } else {
                    throw new Error('There must be at least one AuthProvider.');
                }
            }
        });
    }

    private firebaseUIPopup() {
        let firebaseUiInstance = this.firebaseUIService.firebaseUiInstance;
        firebaseUiInstance.start('#firebaseui-auth-container', FirebaseUIComponent.getUIAuthConfig(this.firebaseUiConfig));
    }
}
