import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {FirebaseUIModule} from 'firebaseui-angular';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {path: '', component: MainComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FirebaseUIModule.forFeature({tosUrl: 'MAIN_MODULE'}),
    RouterModule.forChild(routes)
  ],
  declarations: [MainComponent]
})
export class MainModule {
}
