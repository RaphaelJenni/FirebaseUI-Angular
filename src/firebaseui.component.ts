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
    providers: Array<AuthProvider | AuthProviderWithCustomConfig | AuthProviders>;
    method?: AuthMethods;
    signInSuccessUrl?: string;
    tos?: string;
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
            if (!!(provider as AuthProviderWithCustomConfig).customConfig) {
                provider = (provider as AuthProviderWithCustomConfig);

                let providerWithConfig = provider.customConfig;
                providerWithConfig['provider'] = FirebaseUIComponent.getAuthProvider(provider.provider);

                authProviders.push(providerWithConfig);
            } else {
                authProviders.push(FirebaseUIComponent.getAuthProvider(provider as AuthProvider));
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

        if (!!authConfig.signInSuccessUrl) {
            return {
                callbacks: {
                    signInSuccess: () => true
                },
                signInSuccessUrl: authConfig.signInSuccessUrl,
                signInFlow: authMethod,
                signInOptions: authProviders,
                tosUrl: tosURL
            };
        } else {
            return {
                callbacks: {
                    signInSuccess: () => false
                },
                signInFlow: authMethod,
                signInOptions: authProviders,
                tosUrl: tosURL
            };
        }

    }

    private static getAuthProvider(provider: AuthProvider): string {
        switch (provider) {
            case AuthProvider.Google:
                return firebase.auth.GoogleAuthProvider.PROVIDER_ID;
            case AuthProvider.Facebook:
                return firebase.auth.FacebookAuthProvider.PROVIDER_ID;
            case AuthProvider.Twitter:
                return firebase.auth.TwitterAuthProvider.PROVIDER_ID;
            case AuthProvider.Github:
                return firebase.auth.GithubAuthProvider.PROVIDER_ID;
            case AuthProvider.Password:
                return firebase.auth.EmailAuthProvider.PROVIDER_ID;
            case AuthProvider.Phone:
                return firebase.auth.PhoneAuthProvider.PROVIDER_ID;
        }
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
