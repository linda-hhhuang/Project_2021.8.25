import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { HomeRoutingModule } from './home-routing.module';
import { NavComponent } from './components/nav/nav.component';
import { SharedModule } from '@shared/shared.module';
import { PrintComponent } from './components/print/print.component';
@NgModule({
  declarations: [MainComponent, NavComponent, PrintComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
