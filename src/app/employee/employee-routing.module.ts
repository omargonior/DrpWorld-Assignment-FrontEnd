import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { ProfileComponent } from './profile/profile.component';
import { CheckInComponent } from './check-in/check-in.component';
import { AttendanceHistoryComponent } from './attendance-history/attendance-history.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Employee'] },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'check-in', component: CheckInComponent },
      { path: 'attendance-history', component: AttendanceHistoryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
