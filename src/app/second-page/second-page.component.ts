import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUIModule } from 'firebaseui-angular';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'fbui-ng-second-page',
    templateUrl: './second-page.component.html',
    styleUrls: ['./second-page.component.scss'],
    standalone: true,
    imports: [FirebaseUIModule, RouterLink]
})
export class SecondPageComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => console.log(d));
  }

  logout() {
    this.afAuth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log(data);
  }
}
