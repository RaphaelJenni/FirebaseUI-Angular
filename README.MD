[![Build Status](https://travis-ci.org/RaphaelJenni/FirebaseUI-Angular.svg?branch=master)](https://travis-ci.org/RaphaelJenni/FirebaseUI-Angular)
[![npm version](https://badge.fury.io/js/firebaseui-angular.svg)](https://badge.fury.io/js/firebaseui-angular)

# FirebaseUi-Angular

![Screenshot of Login screen](https://raw.githubusercontent.com/RaphaelJenni/FirebaseUI-Angular/master/assets/LoginScreen.PNG)

## Installation

To install this library, run:

```bash
$ npm install firebaseui-angular --save
```

To run this library you need to have [AngularFire](https://github.com/angular/angularfire2), [Firebase](https://firebase.google.com/docs/web/setup), 
[FirebaseUI-Web](https://github.com/firebase/firebaseui-web) installed.
Fast install:
```bash
$ npm install firebase firebaseui angularfire2 firebaseui-angular --save
```

## How to use

Add the `FirebaseUIModule` with the config to your imports. Make sure you have initialized [AngularFire](https://github.com/angular/angularfire2) correctly.


```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  AuthMethods,
  AuthProvider,
  AuthProviderWithCustomConfig,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUIModule
} from 'firebaseui-angular';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppRoutingModule } from './app-routing.module';

const facebookCustomConfig: AuthProviderWithCustomConfig = {
  provider: AuthProvider.Facebook,
  customConfig: {
    scopes: [
      'public_profile',
      'email',
      'user_likes',
      'user_friends'
    ],
    customParameters: {
      // Forces password re-entry.
      auth_type: 'reauthenticate'
    }
  }
};

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    facebookCustomConfig,
    AuthProvider.Twitter,
    AuthProvider.Github,
    AuthProvider.Password,
    AuthProvider.Phone
  ],
  method: AuthMethods.Popup,
  tos: '<your-tos-link>',
  credentialHelper: CredentialHelper.AccountChooser
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

### Add the firebaseui css to your imports:

**Option 1: CSS Import**

*May be incompatible with older browsers.*

Import the firebaseui css to your `src/styles.css` file:
```css
@import '~firebaseui/dist/firebaseui.css';
```
**Option 2: Angular-CLI**

File: `angular.json`

Path: `"node_modules/firebaseui/dist/firebaseui.css"`
```json
{
  "projects": {
    [your-project-name]: {
      ...
      "architect": {
        "build": {
          "options": {
            ...
            "styles": [
              "src/styles.css",
              "node_modules/firebaseui/dist/firebaseui.css"
            ]
          }
        },
        ...
        "test": {
          "options": {
            ...
            "styles": [
              "src/styles.css",
              "node_modules/firebaseui/dist/firebaseui.css"
            ]
          }
        }
      }
    }
  }
}
```
**Option 3: HTML Link**

Put this in the `<head>` tag of your `index.html` file:
```html
<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.0.0/firebaseui.css" />
```
Make sure the version number matches the version of firebaseui you have installed with npm.


Once everything is set up, you can use the component in your Angular application:

```angular2html
<firebase-ui></firebase-ui>
```

### Config

FirebaseUIAuthConfig

<table>
<thead>
<tr>
<th>Property</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>providers</td>
<td>Yes</td>
<td>
<ul>
<li>AuthProvider.Google</li>
<li>AuthProvider.Facebook</li>
<li>AuthProvider.Twitter,</li>
<li>AuthProvider.Github</li>
<li>AuthProvider.Password</li>
<li>AuthProvider.Phone</li>
</ul>

or [AuthProviderWithCustomConfig](#authproviderwithcustomconfig)
</td>
</tr>
<tr>
<td>method</td>
<td>No</td>
<td>
<ul>
<li>AuthMethods.Popup</li>
<li>AuthMethods.Redirect</li>
</ul>

<i>Default: Popup</i>
</td>
</tr>
<tr>
<td>tos</td>
<td>No</td>
<td>
The link to your terms of services

<i>Default: '''</i>
</td>
</tr>
<tr>
<td>signInSuccessUrl</td>
<td>No</td>
<td>
The url whre the user should be redirected.

It is a hard redirect, so it isn't the angular way. Better do it with authState listener.

<i>Default: No redirect</i>
</td>
</tr>
<tr>
<td>CredentialHelper</td>
<td>No</td>
<td>
<ul>
<li>AccountChooser</li>
<li>OneTap</li>
<li>None</li>
</ul>

<i>Default: AccountChooser</i>
</td>
</tr>
</tbody>
</table>

#### AuthProviderWithCustomConfig
To see the custom configs, check the firebaseUI doc: [Provider configuration](https://github.com/firebase/firebaseui-web#configure-oauth-providers)

```json
 provider: AuthProvider.Facebook,
 customConfig: {
    ...
  }
```

### Listen to auth state changes
```typescript
this.angularFireAuth.authState.subscribe(this.firebaseAuthChangeListener);

private firebaseAuthChangeListener(response) {
    // if needed, do a redirect in here
    if (response) {
      console.log('Logged in :)');
    } else {
      console.log('Logged out :(');
    }
  }
```
Don't forget to unsubscribe at the end.

### SignInSuccess Callback

```html
<firebase-ui (signInSuccess)="successCallback($event)"></firebase-ui>
```

```typescript
successCallback(signInSuccessData: FirebaseUISignInSuccess) {
    ...
}
```

## Sample

There is a sample project in the `sample` folder.
Just replace the firebase config in `sample\src\environments\environment.ts`.

Then you can run it via the angular-cli.

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build-lib
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## Troubleshoot
### CSS not loaded
If you have added the css to the angular.json but nothing happened. Try to restart the server (`Ctrl-C` and `ng serve`)

### ERROR in ./~/firebase/app/shared_promise.js

 This is a know issue in the firebase project. To fix that (for now), do that:
 
`npm install promise-polyfill --save-exact`

## License

MIT © [Raphael Jenni](mailto:info@rjenni.ch)
