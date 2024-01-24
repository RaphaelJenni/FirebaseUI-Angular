import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseUIModule } from 'firebaseui-angular';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'fbui-ng-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: true,
    imports: [FirebaseUIModule, RouterLink]
})
export class MainComponent implements OnInit {


  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => console.log(d));
  }

  logout() {
    this.afAuth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    this.router.navigate(['page']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  uiShownCallback() {
    console.log('UI shown');
  }
}
