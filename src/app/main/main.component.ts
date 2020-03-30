import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseuiAngularLibraryService, FirebaseUILanguages, FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';

@Component({
  selector: 'fbui-ng-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public languages = FirebaseUILanguages;
  public currentLang: string = "";

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseUiService: FirebaseuiAngularLibraryService) {

    // Update the select element to match the language specified in the app.module.ts file during the initial configuration
    this.currentLang = this.firebaseUiService.getCurrentLanguage().code;
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => console.log(d));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    this.router.navigate(['page']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  changeLang(code: string) {
    this.firebaseUiService
      .setFirebaseUILanguage(code)
      .then(() => {
        console.log("Changed language");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
