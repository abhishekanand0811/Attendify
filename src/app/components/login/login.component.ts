import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { HelperService } from '../../services/helper/helper.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  userEmail: string = '';
  password: string = '';

  constructor(@Inject(UserService) private UserService: UserService, @Inject(HelperService) private helperService:HelperService, private router:Router, private toastr:ToastrService) { }

  handleSubmit(e: Event){
    e.preventDefault();
    // console.log(this.userEmail, this.password);
    if (!this.userEmail || !this.password){
      this.toastr.warning("Please fill all required fields!");
      return;
    }
    let data = {
      userEmail: this.userEmail,
      password:  this.password
    }

    this.helperService.startLoader();

    this.UserService.loginUser(data).subscribe({
      next:(resp:any)=>{
        // console.log(resp);
        this.helperService.login(resp);
        this.helperService.sendMessage("userLoggedIn");
        this.toastr.success("User logged In");
        if(resp.userDetails.authenticated){
          this.router.navigateByUrl('/dashboard');
        }
        else{
          this.router.navigateByUrl('/validate-otp');
        }
        this.helperService.stopLoader();
      },
      error:(err:any)=>{
        // console.log(err);
        this.toastr.error("Invalid credentials");
        this.helperService.stopLoader();
      }
    });
    

  }

}
