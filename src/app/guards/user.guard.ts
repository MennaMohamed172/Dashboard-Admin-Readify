import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';


export const userGuard: CanActivateFn = (route, state) => {
  const UserSer=inject(UserService)
  const router=inject(Router)

  if( UserSer.isUserLogged){
    return true;
  }else{
    // alert("plz login first")
    router.navigate(['/login'])
    return false
  }
};
