import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalId: string;
  age: number;
  signature?: string;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber', 'nationalId', 'age', 'signature', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    // Always send default paging parameters and searchTerm
    const params = { pageNumber: 1, pageSize: 10, SearchTerm: this.searchTerm || '' };
    this.adminService.getPagedEmployees(params).subscribe({
      next: (data) => {
        this.dataSource.data = data.items;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: () => {
        this.snackBar.open('Failed to load employees', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadEmployees();
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/admin/edit-employee', employee.id]);
  }

  deleteEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.adminService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted', 'Close', { duration: 2000 });
          this.loadEmployees(); // Just reload the list, do not navigate
        },
        error: () => {
          this.snackBar.open('Failed to delete employee', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
