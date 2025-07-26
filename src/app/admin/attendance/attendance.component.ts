import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AttendanceRecord {
  firstName: string;
  lastName: string;
  todayCheckIn: string | null;
  weeklyHours: number;
  attendanceSummary?: string;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'todayCheckIn', 'totalHours', 'totalDaysCheckedIn'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.adminService.getAttendanceSummary().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: () => {
        this.snackBar.open('Failed to load attendance', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  computeHours(checkInTime: string): number {
    if (!checkInTime) return 0;
    const checkIn = new Date(checkInTime);
    const now = new Date();
    let diff = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60); // hours
    if (diff < 0) diff = 0;
    if (diff > 8) diff = 8;
    return Math.floor(diff);
  }
}
