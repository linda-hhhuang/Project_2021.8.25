import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@core/components/login/login.component';
import { LoginRedirectComponent } from '@core/components/login-redirect/login-redirect.component';
import { AuthGuard } from '@core/service/auth.guard';

const routes: Routes = [
  { path: '', component: LoginRedirectComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./home/home.module').then((mod) => mod.HomeModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
