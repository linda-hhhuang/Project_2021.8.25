import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TARedirectComponent } from './components/ta-redirect/ta-redirect.component';
import { AdminGuard } from './services/admin.guard';
import { StudentGuard } from './services/student.guard';
import { TeacherGuard } from './services/teacher.guard';

const routes: Routes = [
  {
    path: '',
    component: TARedirectComponent,
  },
  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    loadChildren: () =>
      import('./teacher/teacher.module').then((mod) => mod.TeacherModule),
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    loadChildren: () =>
      import('./student/student.module').then((mod) => mod.StudentModule),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((mod) => mod.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TARoutingModule {}
