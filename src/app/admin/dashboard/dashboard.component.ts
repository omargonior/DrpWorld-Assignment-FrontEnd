import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  adminName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.authService['jwtHelper'].decodeToken(token);
      this.adminName = decoded['given_name'] || decoded['name'] || decoded['unique_name'] || null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
