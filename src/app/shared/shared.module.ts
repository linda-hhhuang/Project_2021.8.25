import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiAntdModule } from './ui-antd/ui-antd.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentOperationComponent } from './components/student-operation/student-operation.component';
@NgModule({
  declarations: [StudentOperationComponent],
  imports: [CommonModule, UiAntdModule, FormsModule, ReactiveFormsModule],
  exports: [
    UiAntdModule,
    FormsModule,
    ReactiveFormsModule,
    StudentOperationComponent,
  ],
})
export class SharedModule {}
