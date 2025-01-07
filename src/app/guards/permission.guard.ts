import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.currentUserValue) {
    const requiredPermission = route.data['permission'] as string;

    if (!requiredPermission) {
      return true;
    }

    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      const permissions = JSON.parse(storedPermissions);

      if (permissions.includes(requiredPermission)) {
        return true;
      }
    }

    router.navigate(['/404']);

    return true;
  }

  router.navigate(['/login']);
  return false;
};
