import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/Auth/login';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(email: string, password: string): Observable<{ token: string, role: string }> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
      }),
      map(res => {
        const decoded = this.jwtHelper.decodeToken(res.token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'];
        return { token: res.token, role };
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'] || null;
  }
} 