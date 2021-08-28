import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentMainComponent } from './components/student-main/student-main.component';
import { StudentPersonalComponent } from './components/student-personal/student-personal.component';
import { SharedModule } from '@shared/shared.module';
import { StudentScoreComponent } from './components/student-score/student-score.component';

@NgModule({
  declarations: [
    StudentHomeComponent,
    StudentMainComponent,
    StudentPersonalComponent,
    StudentScoreComponent,
  ],
  imports: [CommonModule, StudentRoutingModule, SharedModule],
})
export class StudentModule {}
