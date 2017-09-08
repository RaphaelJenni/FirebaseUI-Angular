import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'page', loadChildren: 'app/second-page/second.module#SecondModule'},
  {path: '', loadChildren: 'app/main/main.module#MainModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

