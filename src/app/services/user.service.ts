
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  UserAuthBehavior: BehaviorSubject<boolean>;
  constructor() {
    this.UserAuthBehavior = new BehaviorSubject<boolean>(this.isUserLogged);
  }
  get isUserLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
  userLoggedIn(email: string, token: string): void {
    // let userToken = '987654';
    localStorage.setItem('token', token);
    this.UserAuthBehavior.next(this.isUserLogged);
  }
  userLoggedOut(): void {
    localStorage.removeItem('token');
    this.UserAuthBehavior.next(this.isUserLogged);
  }
  
  getUserStatus(): Observable<boolean> {
    return this.UserAuthBehavior.asObservable();
  }

}
