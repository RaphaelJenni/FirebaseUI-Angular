import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {FirebaseUIAuthConfig, FirebaseUIModule} from "firebaseui-angular";
import {environment} from "../environments/environment";
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProviders.Google,
    AuthProviders.Facebook,
    AuthProviders.Twitter,
    AuthProviders.Github,
    AuthProviders.Password
  ],
  method: AuthMethods.Popup,
  tos: '<your-tos-link>'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
