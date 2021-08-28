import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentMainComponent } from './components/student-main/student-main.component';
import { StudentPersonalComponent } from './components/student-personal/student-personal.component';
import { StudentScoreComponent } from './components/student-score/student-score.component';
const routes: Routes = [
  {
    path: '',
    component: StudentMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: StudentHomeComponent },
      {
        path: 'personal',
        component: StudentPersonalComponent,
      },
      {
        path: 'score',
        component: StudentScoreComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
