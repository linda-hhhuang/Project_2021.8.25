import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { TARoutingModule } from './ta-routing.module';
import { TARedirectComponent } from './components/ta-redirect/ta-redirect.component';

@NgModule({
  declarations: [TARedirectComponent],
  imports: [CommonModule, TARoutingModule, SharedModule],
})
export class TAModule {}
