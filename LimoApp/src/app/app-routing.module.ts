import { RequestComponent } from './request/request.component';
import { EtaComponent } from './eta/eta.component';
import { LoadingPage } from './loading/loading.page';
import { HomePage } from './home/home.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomePage, children: [
    {path: '', redirectTo: 'loading', pathMatch: 'full'},
    {path: 'loading', component: RequestComponent},
    {path: 'eta', component: EtaComponent}
  ]},
  { path: 'loading', component: LoadingPage }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
