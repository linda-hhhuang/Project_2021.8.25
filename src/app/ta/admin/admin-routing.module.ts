import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { AdminExportComponent } from './components/admin-export/admin-export.component';
import { AdminGroupComponent } from './components/admin-group/admin-group.component';
import { AdminMemberStudentComponent } from './components/admin-member-student/admin-member-student.component';
import { AdminMemberTeacherComponent } from './components/admin-member-teacher/admin-member-teacher.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AdminHomeComponent },
      { path: 'student', component: AdminMemberStudentComponent },
      { path: 'teacher', component: AdminMemberTeacherComponent },
      { path: 'group', component: AdminGroupComponent },
      { path: 'export', component: AdminExportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
