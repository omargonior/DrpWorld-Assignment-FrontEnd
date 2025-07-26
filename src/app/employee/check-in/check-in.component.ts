import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  checkedIn = false;
  checkInTime: string | null = null;
  canCheckIn = false;
  loading = true;
  error: string | null = null;
  success: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<any[]>('/api/employee/attendance').subscribe({
      next: (records) => {
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        const todayRecord = records.find(r => r.checkInTime && r.checkInTime.startsWith(todayStr));
        if (todayRecord) {
          this.checkedIn = true;
          this.checkInTime = todayRecord.checkInTime;
        }
        this.canCheckIn = this.isWithinCheckInWindow() && !this.checkedIn;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load attendance.';
      }
    });
  }

  isWithinCheckInWindow(): boolean {
    const now = new Date();
    const start = new Date(now);
    start.setHours(7, 30, 0, 0);
    const end = new Date(now);
    end.setHours(9, 0, 0, 0);
    return now >= start && now <= end;
  }

  onCheckIn() {
    this.loading = true;
    this.error = null;
    this.success = null;
    this.http.post('/api/employee/check-in', {}).subscribe({
      next: (res: any) => {
        this.success = res && res.message ? res.message : 'Checked in successfully.';
        this.checkedIn = true;
        this.checkInTime = new Date().toISOString();
        this.canCheckIn = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'You have already checked in today or it is outside the check-in window (7:30 AM - 9:00 AM).';
        this.loading = false;
      }
    });
  }
}
