import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FirebaseUIService } from './firebaseui.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import * as firebaseui from 'firebaseui';
import {
    AuthMethods, AuthProvider, AuthProviderWithCustomConfig, CredentialHelper, FirebaseUIAuthConfig,
    FirebaseUISignInSuccess
} from './firebaseui.helper';
import * as firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import TwitterAuthProvider = firebase.auth.TwitterAuthProvider;
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import PhoneAuthProvider = firebase.auth.PhoneAuthProvider;



/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

@Component({
    selector: 'firebase-ui',
    template: `
        <div id="firebaseui-auth-container"></div>`
})
export class FirebaseUIComponent implements OnInit, OnDestroy {

    @Output('signInSuccess') signInSuccessCallback: EventEmitter<FirebaseUISignInSuccess> = new EventEmitter();

    private subscription: Subscription;

    private static getAuthProvider(provider: AuthProvider): string {
        switch (provider) {
            case AuthProvider.Google:
                return GoogleAuthProvider.PROVIDER_ID;
            case AuthProvider.Facebook:
                return FacebookAuthProvider.PROVIDER_ID;
            case AuthProvider.Twitter:
                return TwitterAuthProvider.PROVIDER_ID;
            case AuthProvider.Github:
                return GithubAuthProvider.PROVIDER_ID;
            case AuthProvider.Password:
                return EmailAuthProvider.PROVIDER_ID;
            case AuthProvider.Phone:
                return PhoneAuthProvider.PROVIDER_ID;
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
        if (!!this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private getUIAuthConfig(authConfig: FirebaseUIAuthConfig): Object {
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
            case AuthMethods.Redirect:
                authMethod = 'redirect';
                break;
            case null:
            case AuthMethods.Popup:
            default:
                break;
        }

        let credentialHelper;
        switch (authConfig.credentialHelper) {
            case CredentialHelper.None:
                credentialHelper = firebaseui.auth.CredentialHelper.NONE;
                break;
            case CredentialHelper.OneTap:
                credentialHelper = firebaseui.auth.CredentialHelper.GOOGLE_YOLO;
                break;
            case CredentialHelper.AccountChooser:
            default:
                credentialHelper = firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM;
                break;
        }

        let nativeConfiguration: FirebaseUINativeConfiguration = {
            callbacks: {
                signInSuccess: (currentUser, credential, redirectUrl) => {
                    this.signInSuccessCallback.emit({
                        currentUser,
                        credential,
                        redirectUrl
                    });
                    return !!authConfig.signInSuccessUrl;
                }
            },
            signInFlow: authMethod,
            signInOptions: authProviders,
            tosUrl: tosURL,
            credentialHelper: credentialHelper
        };
        if (!!authConfig.signInSuccessUrl) {
            nativeConfiguration.signInSuccessUrl = authConfig.signInSuccessUrl;
        }
        return nativeConfiguration;
    }

    private firebaseUIPopup() {
        let firebaseUiInstance = this.firebaseUIService.firebaseUiInstance;
        firebaseUiInstance.start('#firebaseui-auth-container', this.getUIAuthConfig(this.firebaseUiConfig));
    }
}

interface FirebaseUINativeConfiguration {
    callbacks?: any;
    credentialHelper?: any;
    queryParameterForSignInSuccessUrl?: string;
    queryParameterForWidgetMode?: string;
    signInFlow?: string;
    signInOptions?: any;
    signInSuccessUrl?: string;
    tosUrl: string;
}
