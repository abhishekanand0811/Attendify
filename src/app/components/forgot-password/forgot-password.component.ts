import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper/helper.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  userEmail: string = '';
  otpValidated: boolean = false;
  password: string = '';

  constructor(@Inject(UserService)private userService:UserService, private router:Router, private toastr:ToastrService, @Inject(HelperService) private helperService:HelperService){}

  ngOnInit() {
    let forgotPassword = sessionStorage.getItem('forgotPassword');
    if(forgotPassword && JSON.parse(forgotPassword).otpValidated){
      this.otpValidated = true;
    }
    // console.log(this.otpValidated);
  }

  submitEmail(event: Event){
    event.preventDefault();
    // console.log(this.userEmail);
    if(!this.userEmail){
      this.toastr.warning('Please enter a valid email address');
      return;
    }
    let data = {
      userEmail: this.userEmail
    }
    this.helperService.startLoader();

    this.userService.forgotPassword(data).subscribe({
      next:(resp)=>{
        // console.log(resp);
        sessionStorage.setItem('forgotPassword', JSON.stringify({userEmail:this.userEmail, otpValidated:false}));
        this.router.navigateByUrl('/validate-otp');
        this.toastr.success('Forgot Password Request Raised Successfully');
        this.helperService.stopLoader();
      },
      error:(err)=>{
        this.toastr.error(err.error?.message);
        console.log(err);
        this.helperService.stopLoader();
      }
    });
  }

  submitPassword(event:Event){
    event.preventDefault();
    // console.log(this.password);
    if(!this.password){
      this.toastr.warning('Please enter a password');
      return;
    }
    let forgotPassword = sessionStorage.getItem('forgotPassword');
    if(forgotPassword && JSON.parse(forgotPassword).otpValidated){
      this.userEmail =JSON.parse(forgotPassword).userEmail;
    }
    let data = {
      userEmail: this.userEmail,
      password:  this.password
    }
    this.helperService.startLoader();
    
    this.userService.resetPassword(data).subscribe({
      next:(resp:any)=>{
        // console.log(resp);
        sessionStorage.removeItem('forgotPassword');
        this.router.navigateByUrl('/login');
        this.toastr.success('Password reset successfully');
        this.helperService.stopLoader();
      },
      error:(err:any)=>{
        this.toastr.error(err.error?.message);
        console.log(err);
        this.helperService.stopLoader();
      }
    });
  }

}
