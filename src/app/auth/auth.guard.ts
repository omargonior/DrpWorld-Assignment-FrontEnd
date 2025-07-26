import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }
    const allowedRoles = route.data['roles'] as string[] | undefined;
    if (allowedRoles && !allowedRoles.includes(this.authService.getUserRole() || '')) {
      // Redirect to login or a forbidden page
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
} 