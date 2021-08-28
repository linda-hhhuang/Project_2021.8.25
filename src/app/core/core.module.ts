import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [LoginComponent, LoginRedirectComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModule,
    };
  }
}
