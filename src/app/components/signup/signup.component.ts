import { Component, Inject } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { FormsModule } from '@angular/forms';
import { HelperService } from '../../services/helper/helper.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  userEmail: string = '';
  password: string = '';
  name: string = '';

  constructor(@Inject(UserService) private UserService: UserService, @Inject(HelperService) private helperService:HelperService, private router:Router, private toastr:ToastrService) { }

  handleSubmit(e: Event){
    e.preventDefault();
    // console.log(this.userEmail, this.password);
    if (!this.userEmail || !this.password || !this.name){
      this.toastr.warning("Please fill all required fields!");
      return;
    }

    let data = {
      userEmail: this.userEmail,
      password:  this.password,
      name: this.name
    }

    this.helperService.startLoader();

    this.UserService.signUpUser(data).subscribe({
      next:resp=>{
        // console.log(resp);
        this.helperService.login(resp);
        this.helperService.sendMessage("userLoggedIn");
        this.router.navigateByUrl('/validate-otp');
        this.toastr.success("User Created Successfully!");
        this.helperService.stopLoader();
      },
      error:err=>{
        console.log(err);
        this.toastr.error(err.error?.message);
        this.helperService.stopLoader();
      }
    });
  }

}
