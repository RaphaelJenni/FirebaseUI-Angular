# Changelog

## 6.0.0-beta.0
* Compatibility with @angular/fire@^7.0.0 [#158](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/158)
  * FirebaseUI needs to add support for firebase@9 (See [#877](https://github.com/firebase/firebaseui-web/issues/877)).
    Use `firebase@next` version (0.600.0) to get support for the compat layer.
* Change from View Engine to Ivy

## 5.1.3
* Add support for Angular 12 [#157](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/157)

## 5.1.2
* Add support for Auth Emulator [#142](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/142)

## 5.1.1
* Add support for Angular 11

## 5.1.0
* Add support for firebase@^8.0.0

## 5.0.1
* Add support for uiShow Callback [#133](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/133)

## 5.0.0
* Upgrade library to support @angular/fire@6.0.0 [#121](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/121)

## 4.1.0
* Update to Angular 9 [#113](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/92) Thanks to @l0ll098 for the PR

## 4.0.0
* Dump old configurations
* Update sample project to Angular 8
* Update peer dependencies configuration

## 3.4.2
* Fix service provided always in root instead of AngularFireAuthModule [#92](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/92)

## 3.4.1
* Fix callbacks running outside the angular zone [#85](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/85)
* Fix bug introduced with 3.4.0

## 3.4.0
* Add forFeature module initializer [#57](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/57)

## 3.3.3
* Fix callbacks not getting updated [#81](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/81)

## 3.3.2
* Workaround for --prod build error [#76](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76)

## 3.3.1
* Fix [#77](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/77)
* Update dependencies

## 3.3.0
* (**IMPORTANT**) Migrate from firebaseui-angular config to firebaseui config
  _After updating run your app and you will get the new configuration printed to the console._
* Update dependencies
* Fix [#73](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/73)
* Fix [#74](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/74)

## 3.2.0
* Updated dependencies [#72](https://github.com/RaphaelJenni/FirebaseUI-Angular/pull/72) (Thanks to @arjunyel)

## 3.1.1
* Fixed support for Angular < 6 [#68](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/68)

## 3.1.0
* Update project to be compatible with firebaseui v3.1.0 [#63](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/63) / [#65](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/65)
* Update Readme with information about the sample project - Fix [#64](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/64)

## 3.0.4
* fix (upgradeAnonymousUser): Enable display with firebaseUI for anonymous user [#59](https://github.com/RaphaelJenni/FirebaseUI-Angular/pull/59)

## 3.0.3
* doc update [#58](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/58)

## 3.0.2
* Added missing callbacks (error) option [#53](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/53)
* Added deprecated firebaseui callback and a flag to disable it (this will be default in the future)

## 3.0.1
* Added missing autoUpgradeAnonymousUsers option [#53](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/53)
* Fixed npm audit

## 3.0.0
* Added support for firebaseui@3 and firebase@5

## 2.6.2
* Fixed "method" default not working [#40](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/40)

## 2.6.1
* Fixed firebase imports [#32](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/32)
* Updated build script and all dependencies

## 2.6.0
* Fixed firebase imports - [#29](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/29)

## 2.5.3
* Fixed ONE_TAP Login - [pull/30](https://github.com/RaphaelJenni/FirebaseUI-Angular/pull/30)

## 2.5.2
* Removed rxjs import

## 2.5.1
* Updated README
* Removed deprecated ENUM

## 2.5.0
* Fixed [#25](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/25)
* Updated libraries
* Added one-tap sign-up [#27](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/27)

## 2.4.0
* adjust the plugin version to the firebaseui version
* updated dependency to firebaseui 2.4.0 / angularfire 25.0.0-rc.3 / firebase 4.5.2

## 0.4.5
* credentialHelper [#20](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/20)

## 0.4.4
* Lazy loading FirebaseUIModule [#19](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/19)

## 0.4.3
* signInSuccess callback needed [#14](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/14)
* added a helper file for all the classes and enums

## 0.4.2
* Added README to npm

## 0.4.1
* Custom configs can be set now
* RedirectUrl can be set now
* Changed enum name AuthProviders -> AuthProvider

Issue [#8](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/8)

## 0.4.0
* Upgraded to Firebase 4.1.2 / FirebaseUI 2.1.1 / AngularFire 4.0.0-rc.1
* Released version 0.4.0

Issue [#7](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/7)

## 0.3.0
* Upgraded to Firebase 4.0.0 / FirebaseUI 2.0.0
* Fixed modal showing bug [#5](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/5)
* Updated sample and readme

## 0.2.0

[Diff](https://github.com/RaphaelJenni/FirebaseUI-Angular/compare/bba132822e26f9e219f9069389423ba25d34dc91...e52710573a720e0724a8d7ecfee960297cc4a112)
* Upgrade to AngularFire 4.0 / Firebase 3.9.0 / Angular 4.1.1 [#2](https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/2)


## 0.1.5

* FirebaseUI Integration into Angular
