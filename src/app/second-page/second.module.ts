import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SecondPageComponent} from './second-page.component';
import {FirebaseUIModule} from 'firebaseui-angular';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: SecondPageComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FirebaseUIModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SecondPageComponent]
})
export class SecondModule {
}
