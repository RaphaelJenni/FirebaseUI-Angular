# firebaseui-angular

## Installation

To install this library, run:

```bash
$ npm install firebaseui-angular --save
```

To run this library you need to have [AngularFire](https://github.com/angular/angularfire2), [Firebase](https://firebase.google.com/docs/web/setup), 
[FirebaseUI-Web](https://github.com/firebase/firebaseui-web) installed.
Fast install:
```bash
$ npm install firebase firebaseui angularfire2 firebaseui-angular --save
```

## How to use

Add the `FirebaseUIModule` with the config to your imports. Make sure you have initialized [AngularFire](https://github.com/angular/angularfire2) correctly.


```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { FirebaseUIAuthConfig, FirebaseUIModule } from "firebaseui-angular";
import { AngularFireModule, AuthMethods, AuthProviders } from "angularfire2";
import { environment } from "../environments/environment";


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
export class AppModule {
}

```

Once everything is set up, you can use the component in your Angular application:

```angular2html
<firebase-ui></firebase-ui>
```

### Config

FirebaseUIAuthConfig

<table>
<thead>
<tr>
<th>Property</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>providers</td>
<td>
<ul>
<li>AuthMethods.Popup</li>
<li>AuthMethods.Redirect</li>
</ul>
This providers are coming from AngularFire
</td>
</tr>
<tr>
<td>method</td>
<td>
<ul>
<li>AuthProviders.Google</li>
<li>AuthProviders.Facebook</li>
<li>AuthProviders.Twitter,</li>
<li>AuthProviders.Github</li>
<li>AuthProviders.Password</li>
</ul>
This methods are coming from AngularFire
</td>
</tr>
<tr>
<td>tos</td>
<td>The link to your terms of services</td>
</tr>
</tbody>
</table>

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Raphael Jenni](mailto:info@rjenni.ch)
