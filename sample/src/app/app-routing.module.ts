import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecondPageComponent } from './second-page/second-page.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {path: 'page', component: SecondPageComponent},
  {path: '', component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

