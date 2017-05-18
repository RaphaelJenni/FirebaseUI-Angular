import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AuthMethods, AuthProviders, FirebaseUIAuthConfig, FirebaseUIModule} from 'firebaseui-angular';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { SecondPageComponent } from './second-page/second-page.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProviders.Google,
    AuthProviders.Facebook,
    AuthProviders.Twitter,
    AuthProviders.Github,
    AuthProviders.Password,
    AuthProviders.Phone
  ],
  method: AuthMethods.Popup,
  tos: '<your-tos-link>'
};

@NgModule({
  declarations: [
    AppComponent,
    SecondPageComponent,
    MainComponent
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
