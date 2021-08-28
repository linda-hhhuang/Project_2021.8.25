import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherPersonalComponent } from './components/teacher-personal/teacher-personal.component';
import { TeacherApplyComponent } from './components/teacher-apply/teacher-apply.component';
import { TeacherMainComponent } from './components/teacher-main/teacher-main.component';
import { TeacherHomeComponent } from './components/teacher-home/teacher-home.component';

@NgModule({
  declarations: [
    TeacherPersonalComponent,
    TeacherApplyComponent,
    TeacherMainComponent,
    TeacherHomeComponent,
  ],
  imports: [CommonModule, TeacherRoutingModule, SharedModule],
})
export class TeacherModule {}
