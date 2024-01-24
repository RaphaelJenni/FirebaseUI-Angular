import {ModuleWithProviders, NgModule} from '@angular/core';
import {FirebaseuiAngularLibraryComponent} from './firebaseui-angular-library.component';
import {CommonModule} from '@angular/common';
import {NativeFirebaseUIAuthConfig} from './firebaseui-angular-library.helper';
import {FirebaseuiAngularLibraryService} from './firebaseui-angular-library.service';

@NgModule({
    imports: [
        CommonModule,
        FirebaseuiAngularLibraryComponent
    ],
    providers: [FirebaseuiAngularLibraryService],
    exports: [FirebaseuiAngularLibraryComponent]
})
export class FirebaseUIModule {
  static forRoot(firebaseUiAuthConfig: NativeFirebaseUIAuthConfig): ModuleWithProviders<FirebaseUIModule> {
    return {
      ngModule: FirebaseUIModule,
      providers: [
        {provide: 'firebaseUIAuthConfig', useValue: firebaseUiAuthConfig},
        {provide: 'firebaseUIAuthConfigFeature', useValue: {}}
      ]
    };
  }

  static forFeature(firebaseUIAuthConfig: NativeFirebaseUIAuthConfig | any): ModuleWithProviders<FirebaseUIModule> {
    return {
      ngModule: FirebaseUIModule,
      providers: [
        {provide: 'firebaseUIAuthConfigFeature', useValue: firebaseUIAuthConfig}
      ]
    };
  }
}
