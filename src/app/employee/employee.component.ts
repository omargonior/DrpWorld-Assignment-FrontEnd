import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.authService['jwtHelper'].decodeToken(token);
      this.employeeName = decoded['given_name'] || decoded['name'] || decoded['unique_name'] || null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
