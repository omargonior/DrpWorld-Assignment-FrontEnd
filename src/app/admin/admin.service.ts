import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = '/api/admin/users';

  constructor(private http: HttpClient) {}

  getPagedEmployees(params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/paged`, { params });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createEmployee(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateEmployee(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  getEmployeeById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getAttendanceSummary() {
    return this.http.get<any[]>('/api/admin/users/attendance-summary');
  }
} 