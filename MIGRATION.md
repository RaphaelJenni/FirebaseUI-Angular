# Migrating from `firebaseui-angular` to `@firebase-oss/ui-angular`

`firebaseui-angular` is a wrapper around FirebaseUI for Web v6 (`firebaseui`), which has not been released since
6.1.0 (August 2023). Google has since rewritten FirebaseUI (v7) and ships an official Angular package,
[`@firebase-oss/ui-angular`](https://www.npmjs.com/package/@firebase-oss/ui-angular)
([source](https://github.com/firebase/firebaseui-web)).

This guide covers the most common setups. v7 is a rewrite, not a drop-in replacement: it uses standalone
components, signals and the modular Firebase SDK, and has its own components instead of the single
`<firebase-ui>` widget. Check the [official repository](https://github.com/firebase/firebaseui-web) for the
full and current API.

## Requirements

`@firebase-oss/ui-angular` 7.1 requires `@angular/fire` ^20 and `firebase` ^11 or ^12, so you need **Angular 20**
and the **modular** AngularFire API (`@angular/fire/app`, `@angular/fire/auth`), not `@angular/fire/compat`.

## 1. Swap the packages

```bash
npm uninstall firebaseui-angular firebaseui
npm install @angular/fire@20 firebase@12 @firebase-oss/ui-angular @firebase-oss/ui-core @firebase-oss/ui-styles
```

## 2. Replace the module setup with providers

Before (`app.module.ts`):

```typescript
import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {requireDisplayName: true, provider: firebase.auth.EmailAuthProvider.PROVIDER_ID},
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
};

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
})
export class AppModule {}
```

After (`app.config.ts`):

```typescript
import {ApplicationConfig} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {provideFirebaseUI, provideFirebaseUIPolicies} from '@firebase-oss/ui-angular';
import {initializeUI, providerPopupStrategy, requireDisplayName} from '@firebase-oss/ui-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirebaseUI(apps => initializeUI({
      app: apps[0],
      behaviors: [providerPopupStrategy(), requireDisplayName()],
    })),
    provideFirebaseUIPolicies(() => ({
      termsOfServiceUrl: '<your-tos-link>',
      privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
    })),
  ],
};
```

## 3. Replace the CSS

Remove `firebaseui/dist/firebaseui.css` from `angular.json` / `styles.css` and import the new styles instead:

```css
@import '@firebase-oss/ui-styles/dist.min.css';
```

## 4. Replace `<firebase-ui>` with the new components

There is no single `signInOptions` widget anymore. You put together the screen from components, and the
sign-in methods are the components you render. All components are standalone, so import the ones you use.

```typescript
import {Component} from '@angular/core';
import {User} from '@angular/fire/auth';
import {SignInAuthScreenComponent, GoogleSignInButtonComponent} from '@firebase-oss/ui-angular';

@Component({
  selector: 'app-login',
  imports: [SignInAuthScreenComponent, GoogleSignInButtonComponent],
  template: `
    <fui-sign-in-auth-screen (signIn)="onSignIn($event)">
      <fui-google-sign-in-button />
    </fui-sign-in-auth-screen>
  `,
})
export class LoginComponent {
  onSignIn(user: User) {
    // ...
  }
}
```

### Mapping

| `firebaseui-angular` (v6)                                   | `@firebase-oss/ui-angular` (v7)                                                                                                                                                                                                   |
|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `FirebaseUIModule.forRoot(config)` / `forFeature(config)`   | `provideFirebaseUI(apps => initializeUI({...}))`                                                                                                                                                                                  |
| `<firebase-ui>`                                             | `<fui-sign-in-auth-screen>`, `<fui-sign-up-auth-screen>`, `<fui-oauth-screen>`, `<fui-phone-auth-screen>`, `<fui-email-link-auth-screen>`, `<fui-forgot-password-auth-screen>`                                                    |
| `EmailAuthProvider` in `signInOptions`                      | `<fui-sign-in-auth-screen>` / `<fui-sign-up-auth-screen>`                                                                                                                                                                         |
| `GoogleAuthProvider`, `FacebookAuthProvider`, ...           | `<fui-google-sign-in-button>`, `<fui-facebook-sign-in-button>`, `<fui-github-sign-in-button>`, `<fui-twitter-sign-in-button>`, `<fui-microsoft-sign-in-button>`, `<fui-apple-sign-in-button>`, `<fui-yahoo-sign-in-button>`, `<fui-oauth-button>` |
| `PhoneAuthProvider`                                         | `<fui-phone-auth-screen>`                                                                                                                                                                                                         |
| `AnonymousAuthProvider`                                     | `autoAnonymousLogin()` / `autoUpgradeAnonymousUsers()` behaviors                                                                                                                                                                  |
| `signInFlow: 'popup' \| 'redirect'`                         | `providerPopupStrategy()` / `providerRedirectStrategy()` behaviors                                                                                                                                                                |
| `requireDisplayName`                                        | `requireDisplayName()` behavior                                                                                                                                                                                                   |
| `credentialHelper: GOOGLE_YOLO`                             | `oneTapSignIn({...})` behavior                                                                                                                                                                                                    |
| `tosUrl` / `privacyPolicyUrl`                               | `provideFirebaseUIPolicies(() => ({termsOfServiceUrl, privacyPolicyUrl}))`                                                                                                                                                         |
| `(signInSuccessWithAuthResult)`                             | `(signIn)` output on the screen components, or `injectUserAuthenticated(user => ...)`                                                                                                                                             |
| `(signInFailure)`                                           | No output; the forms display errors themselves. Redirect errors: `<fui-redirect-error>` / `injectRedirectError()`                                                                                                                 |
| `(uiShown)`                                                 | No equivalent                                                                                                                                                                                                                     |
| `FirebaseuiAngularLibraryService.firebaseUiInstance`        | `injectUI()`                                                                                                                                                                                                                      |
| i18n not supported                                          | Built in: `locale` option of `initializeUI` and `setLocale()` (see `@firebase-oss/ui-translations`)                                                                                                                               |
| `angularFireAuth.authState` (compat)                        | `authState(inject(Auth))` from `@angular/fire/auth`                                                                                                                                                                               |
