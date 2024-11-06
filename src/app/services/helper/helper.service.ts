import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  userInfo:any;
  isAuthenticated:boolean = false;
  private messageSubject = new BehaviorSubject<string>('');
  
  constructor(private router:Router, private userService:UserService) { }


  currentMessage = this.messageSubject.asObservable();

  sendMessage(message: string) {
    this.messageSubject.next(message);
  }

  login(userDetails:any){
    this.userInfo = userDetails;
    this.isAuthenticated = true;
    sessionStorage.setItem("JWT_TOKEN", this.userInfo.jwtToken);
    sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  }

  getUserDetails(){
    if(this.userInfo){
      return this.userInfo.userDetails;
    }
    else{
      this.userInfo = sessionStorage.getItem('userInfo');
      this.userInfo = JSON.parse(this.userInfo.userDetails);
      return this.userInfo;
    }
  }

  getUserEmail(){
    if(this.userInfo){
      return this.userInfo.userDetails.userEmail;
    }
    else{
      let forgotPassword = sessionStorage.getItem('forgotPassword');
      if(forgotPassword){
        return JSON.parse(forgotPassword).userEmail;
      }
    }
  }

  isLoggedIn(){
    return !!sessionStorage.getItem('userInfo');
  }

  logOut(){
    this.userInfo = null;
    this.isAuthenticated = false;
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem("JWT_TOKEN");
    this.router.navigateByUrl('/');
  }

  getLoginStatus(){

    this.userInfo = sessionStorage.getItem('userInfo');
    if(this.userInfo){
      this.userInfo = JSON.parse(this.userInfo);
      return true;
    }
    return false;
  }

  validateOtp(){
    if(this.userInfo){
      this.userInfo.userDetails.authenticated = true;
      this.login(this.userInfo);
      this.router.navigateByUrl('/dashboard');
    }
    else{
      let forgotPassword = sessionStorage.getItem('forgotPassword');
      if(!forgotPassword){
        return;
      }
      forgotPassword = JSON.parse(forgotPassword).userEmail;
      sessionStorage.setItem('forgotPassword',JSON.stringify({userEmail:forgotPassword, otpValidated:true}));
      this.router.navigateByUrl('/forgot-password')
    }
  }

  startLoader(){
    this.sendMessage("start-loader");
  }
  
  stopLoader(){
    this.sendMessage("stop-loader");
  }

  isJWTExpired(){
    let token = sessionStorage.getItem('JWT_TOKEN');
    if(!token) return true;

    let decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    let expirationDate = new Date(decoded.exp * 1000);
    let currentDate = new Date();

    return expirationDate < currentDate;
  }

  enableNotification(){
    this.startLoader();
    this.userInfo.userDetails.notificationEnabled = true;
    this.userService.enableNotification(this.userInfo.userDetails).subscribe({
      next: (resp) => {
        this.stopLoader();
        sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        // console.log(resp);
      },
      error: (err) => {
        this.stopLoader();
        console.log(err);
      }
    })

  }

  disableNotification(){
    this.startLoader();
    this.userInfo.userDetails.notificationEnabled = false;
    this.userService.disableNotification(this.userInfo.userDetails).subscribe({
      next: (resp) => {
        this.stopLoader();
        sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        // console.log(resp);
      },
      error: (err) => {
        this.stopLoader();
        console.log(err);
      }
    })

  }
}
