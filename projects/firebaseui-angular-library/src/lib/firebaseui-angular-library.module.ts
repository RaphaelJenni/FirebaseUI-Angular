import {ModuleWithProviders, NgModule} from '@angular/core';
import {FirebaseuiAngularLibraryComponent} from './firebaseui-angular-library.component';
import {CommonModule} from '@angular/common';
import {NativeFirebaseUIAuthConfig, CustomFirebaseUIAuthConfig} from './firebaseui-angular-library.helper';
import {FirebaseuiAngularLibraryService} from './firebaseui-angular-library.service';
import { DynamicLoaderService } from './dynamic-loader.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FirebaseuiAngularLibraryComponent],
  providers: [FirebaseuiAngularLibraryService, DynamicLoaderService],
  exports: [FirebaseuiAngularLibraryComponent]
})
export class FirebaseUIModule {
  static forRoot(firebaseUiAuthConfig: CustomFirebaseUIAuthConfig): ModuleWithProviders<FirebaseUIModule> {
    return {
      ngModule: FirebaseUIModule,
      providers: [
        {provide: 'firebaseUIAuthConfig', useValue: firebaseUiAuthConfig},
        {provide: 'firebaseUIAuthConfigFeature', useValue: {}}
      ]
    };
  }

  static forFeature(firebaseUIAuthConfig: CustomFirebaseUIAuthConfig | any): ModuleWithProviders<FirebaseUIModule> {
    return {
      ngModule: FirebaseUIModule,
      providers: [
        {provide: 'firebaseUIAuthConfigFeature', useValue: firebaseUIAuthConfig}
      ]
    };
  }
}
