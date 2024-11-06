import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './services/user-service/user.service';
import { HelperService } from './services/helper/helper.service';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(HelperService);
  let router = inject(Router);
  // console.log(authService.isLoggedIn());
  if (!authService.isLoggedIn()){
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
