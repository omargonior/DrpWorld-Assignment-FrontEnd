import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  weeklySummary: { daysPresent: number; totalHours: number } = { daysPresent: 0, totalHours: 0 };
  loading = true;
  error: string | null = null;
  signatureFile: File | null = null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loading = true;
    this.http.get('/api/employee/profile').subscribe({
      next: (profile) => {
        this.profile = profile;
        if (this.profile.signatureUrl && !this.profile.signatureUrl.startsWith('data:image')) {
          this.profile.signatureUrl = 'data:image/png;base64,' + this.profile.signatureUrl;
        }
        this.fetchAttendance(); // Load attendance after profile
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load profile.';
      }
    });
  }

  fetchAttendance() {
    this.http.get<any[]>('/api/employee/attendance').subscribe({
      next: (records) => {
        // Compute summary for all records
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
        this.error = 'Failed to load attendance.';
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

  onSignatureFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.signatureFile = file;
    }
  }

  saveSignature() {
    if (!this.signatureFile) return;
    const formData = new FormData();
    formData.append('signature', this.signatureFile);
    this.http.post('/api/employee/signature', formData).subscribe({
      next: () => {
        this.snackBar.open('Signature saved!', 'Close', { duration: 2000 });
        this.reloadProfile(); // reload profile to show signature
      },
      error: () => {
        this.snackBar.open('Failed to save signature.', 'Close', { duration: 2000 });
      }
    });
  }

  reloadProfile() {
    this.loading = true;
    this.http.get('/api/employee/profile').subscribe({
      next: (profile) => {
        this.profile = profile;
        if (this.profile.signatureUrl && !this.profile.signatureUrl.startsWith('data:image')) {
          this.profile.signatureUrl = 'data:image/png;base64,' + this.profile.signatureUrl;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load profile.';
      }
    });
  }
}
