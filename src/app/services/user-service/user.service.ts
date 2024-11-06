import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_API_URL, EndPoints, HELPER_API_URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  private backendUrl:string  = BACKEND_API_URL;

  loginUser(loginDetails: any){
    return this.http.post(`${this.backendUrl+EndPoints.USER_LOGIN}`, loginDetails);  
  }

  signUpUser(loginDetails:any){
    return this.http.post(`${this.backendUrl+EndPoints.USER_SIGNUP}`, loginDetails);  
  }

  validateOtp(userDetails:any){
    return this.http.post(`${this.backendUrl+EndPoints.USER_VALIDATE_OTP}`, userDetails);  
  }

  forgotPassword(userDetails:any){
    return this.http.post(`${this.backendUrl+EndPoints.USER_FORGOT_PASSWORD}`, userDetails);  
  }

  resendOtp(userDetails:any){
    return this.http.post(`${this.backendUrl+EndPoints.USER_RESEND_OTP}`, userDetails);
  }

  resetPassword(userDetails: any){
    return this.http.post(this.backendUrl+EndPoints.USER_RESET_PASSWORD,userDetails);
  }

  enableNotification(userDetails: any){
    return this.http.post(this.backendUrl+EndPoints.USER_ENABLE_NOTIFICATION,userDetails);
  }

  disableNotification(userDetails: any){
    return this.http.post(this.backendUrl+EndPoints.USER_DISABLE_NOTIFICATION,userDetails);
  }

  welcomeUser(): Observable<any>{
    return this.http.get(this.backendUrl);
  }

  contactMe(messageDetails:any){
    return this.http.post(this.backendUrl + EndPoints.USER_CONTACT, messageDetails);
  }

  sendViewCount(data:any){
    return this.http.post(HELPER_API_URL + "/my_website_analytics/website_view", data);
  }
}
