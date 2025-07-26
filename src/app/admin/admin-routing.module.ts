import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', redirectTo: 'employee-list', pathMatch: 'full' },
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'add-employee', component: EmployeeFormComponent },
      { path: 'edit-employee/:id', component: EmployeeFormComponent },
      { path: 'attendance', component: AttendanceComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
