import { CommonModule, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { HelperService } from '../../services/helper/helper.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-validate-otp',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './validate-otp.component.html',
  styleUrl: './validate-otp.component.scss'
})
export class ValidateOtpComponent {
  otpDigits: string[] = ['', '', '', '', '', ''];
  currentFocus: number = 0;

  constructor(@Inject(UserService)private userService: UserService, @Inject(HelperService)private helperService: HelperService, private router:Router, private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  
  onInputChange(index: number, event: any): void {
    if (event.target.value.length === 1) {
      this.focusNext(index); 
    } 
    // else if (event.target.value.length === 0 && index > 0) {
    //   console.log("from here")
    //   this.focusPrevious(index); 
    // }
  }
  
  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && index > 0 && !this.otpDigits[index]) {
      this.focusPrevious(index); 
    }
  }
  
  focusNext(index: number): void {
    if (index < this.otpDigits.length - 1) {
      this.currentFocus = index + 1;
      document.getElementById(`${this.currentFocus}`)?.focus();
    }
  }

  focusPrevious(index: number): void {
    if (index > 0) {
      this.currentFocus = index - 1;
      document.getElementById(`${this.currentFocus}`)?.focus();
    }
  }

  submitOtp(event:Event){
    event.preventDefault();
    // console.log('OTP submitted:', this.otpDigits.join(''));
    let otp = this.otpDigits.join('');
    if (otp.length != 6){
      this.toastr.warning("Please enter a valid 6 - digit OTP");
      return;
    }
    
    let data = {
      userEmail: this.helperService.getUserEmail(),
      otp:  otp
    }
    this.helperService.startLoader();

    this.userService.validateOtp(data).subscribe({
      next:(resp:any)=>{
        // console.log(resp);
        this.helperService.validateOtp();
        this.toastr.success("OTP validated successfully!");
        // this.router.navigateByUrl('/dashboard');
        this.helperService.stopLoader();
        
      },
      error:(err:any)=>{
        console.log(err);
        this.toastr.error(err.error?.message);
        this.helperService.stopLoader();
      }
    });
  }

  resendOtp(){
    let data = {
      userEmail: this.helperService.getUserEmail(),
    }
    this.helperService.startLoader();

    this.userService.resendOtp(data).subscribe({
      next:(resp:any)=>{
      // console.log(resp);
      this.helperService.stopLoader();
    },
      error:(err:any)=>{
        console.log(err);
        this.toastr.error(err.error?.message);
        this.helperService.stopLoader();
      }
    });
  }
}
