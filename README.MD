[![Build Status](https://travis-ci.org/RaphaelJenni/FirebaseUI-Angular.svg?branch=master)](https://travis-ci.org/RaphaelJenni/FirebaseUI-Angular)
[![npm version](https://badge.fury.io/js/firebaseui-angular.svg)](https://badge.fury.io/js/firebaseui-angular)

# FirebaseUi-Angular

![Screenshot of Login screen](https://raw.githubusercontent.com/RaphaelJenni/FirebaseUI-Angular/master/assets/LoginScreen.PNG)

## Installation

To install this library, run:

```bash
$ npm install firebaseui-angular --save
```

To run this library you need to have [AngularFire2](https://github.com/angular/angularfire2), [Firebase](https://firebase.google.com/docs/web/setup), 
[FirebaseUI-Web](https://github.com/firebase/firebaseui-web) installed.
Fast install:
```bash
$ npm install firebase firebaseui @angular/fire firebaseui-angular --save
```

## How to use

Add the `FirebaseUIModule` with the config to your imports. Make sure you have initialized [AngularFire](https://github.com/angular/angularfire2) correctly.


```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';


import {FirebaseUIModule} from 'firebaseui-angular';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';


import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
        'auth_type': 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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

### Configuration
For the configuration of the module see the official firebaseui documentation: [Config](https://github.com/firebase/firebaseui-web#configuration)

_If you use a version prior to 3.3.0 check the [old README](https://github.com/RaphaelJenni/FirebaseUI-Angular/blob/v3.2.0/README.MD)_


#### forRoot/forFeature
To configure the plugin the first time (`main.module.ts`) the `forRoot()` method is used.
It builds the basis for all further uses of the plugin.
But you have the possibility to overwrite the entire or just parts of the configuration in any (sub-)module.

##### forRoot
To overwrite the entire configuration use:
```
FirebaseUIModule.forRoot(firebaseUiAuthConfig: NativeFirebaseUIAuthConfig)
```


##### forFeature
To overwrite just parts of the configuration use:
```
FirebaseUIModule.forFeature(firebaseUiAuthConfig: NativeFirebaseUIAuthConfig)
```
This will use the in `forRoot` provided configuration and overwrite just the newly provided values.


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

### Sign-in success / failure callbacks

```html
<firebase-ui
    (signInSuccessWithAuthResult)="successCallback($event)"
    (signInFailure)="errorCallback($event)"></firebase-ui>
```

```typescript
successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    ...
}

errorCallback(errorData: FirebaseUISignInFailure) {
    ...
}  
```

### Disable autosign

```typescript
constructor(private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService) {
  firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
}
```

## Sample

There is a sample project in the root folder.
* Just replace the firebase config in `src\environments\environment.ts`.
* Run `npm install`
* Run `npm run build-lib`
* Run `ng serve`

## Development

The library sources are in `projects/firebaseui/angular/library`.

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build-lib
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

There are test files, but they are empty at the moment.

## Troubleshoot
### UI not rendered
The UI only gets rendered if the user isn't signed in. So if the UI isn't shown, sign out the user via angular-fire.

### Prod build error
```
ERROR in ./src/app/app.module.ngfactory.js
Module not found: Error: Can't resolve 'firebase/index' in '...'
ERROR in ./src/app/app.module.ngfactory.js
Module not found: Error: Can't resolve 'firebaseui/dist/index' in '...'
```

Use the firebase and firebaseui instances exposed by the plugin:

`import {..., firebase, firebaseui} from 'firebaseui-angular';`

### CSS not loaded
If you have added the css to the angular.json but nothing happened. Try to restart the server (`Ctrl-C` and `ng serve`)

### ERROR in ./~/firebase/app/shared_promise.js

 This is a know issue in the firebase project. To fix that (for now), do that:
 
`npm install promise-polyfill --save-exact`

### `http://localhost:4200/images/buffer.svg?embed` 404 (Not Found)
Put this into your styles.scss file:

```
@supports (-webkit-appearance:none) {
  .mdl-progress:not(.mdl-progress--indeterminate):not(.mdl-progress--indeterminate) > .auxbar,
  .mdl-progress:not(.mdl-progress__indeterminate):not(.mdl-progress__indeterminate) > .auxbar {
    mask: url(/assets/images/buffer.svg?embed) !important;
  }
}
```

and put a `buffer.svg` file into `assets/images`.
This will stop this error message.

## License

MIT © [Raphael Jenni](mailto:info@rjenni.ch)
