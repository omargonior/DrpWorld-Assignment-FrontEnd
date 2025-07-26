import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.css']
})
export class AttendanceHistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'time', 'hours'];
  dataSource = new MatTableDataSource<any>([]);
  weeklySummary: { daysPresent: number; totalHours: number } = { daysPresent: 0, totalHours: 0 };
  loading = true;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<any[]>('/api/employee/attendance').subscribe({
      next: (records) => {
        this.dataSource.data = records;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        // Compute summary for all records (not just current week)
        let daysPresent = 0;
        let totalHours = 0;
        for (const rec of records) {
          if (rec.checkInTime) {
            daysPresent++;
            totalHours += this.computeHours(rec.checkInTime);
          }
        }
        this.weeklySummary = { daysPresent, totalHours };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load attendance history.';
      }
    });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
