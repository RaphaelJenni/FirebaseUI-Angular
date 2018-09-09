import {Component, OnInit} from '@angular/core';
import {FirebaseUISignInSuccess} from 'firebaseui-angular';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'fbui-ng-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.scss']
})
export class SecondPageComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => console.log(d));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccess) {
    console.log(data);
  }
}
