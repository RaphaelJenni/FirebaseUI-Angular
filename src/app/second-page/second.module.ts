import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SecondPageComponent} from './second-page.component';
import {RouterModule, Routes} from '@angular/router';
import {firebase, FirebaseUIModule} from 'firebaseui-angular';

const routes: Routes = [
  {path: '', component: SecondPageComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FirebaseUIModule.forFeature({
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [SecondPageComponent]
})
export class SecondModule {
}
