import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseUIAuthConfig, FirebaseUIComponent } from './firebaseui.component';

export * from './firebaseui.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FirebaseUIComponent,
    ],
    exports: [
        FirebaseUIComponent,
    ]
})
export class FirebaseUIModule {
    static forRoot(firebaseUiAuthConfig: FirebaseUIAuthConfig): ModuleWithProviders {
        return {
            ngModule: FirebaseUIModule,
            providers: [
                {provide: FirebaseUIAuthConfig, useValue: firebaseUiAuthConfig}
            ]
        };
    }
}
