import { Component, inject } from '@angular/core';
import { HelperService } from '../../services/helper/helper.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {


  helperService = inject(HelperService);
  toastr = inject(ToastrService);
  userService = inject(UserService);
  userInfo = this.helperService.getUserDetails();
  password:any;

  authStatus: any;
  name: any;
  userEmail: any;
  message: any;

  ngOnInit() {
    if(this.userInfo.authenticated) {
      this.authStatus = true;
    }
    // console.log(this.userInfo.notificationEnabled);
  }

  notificationClick(){
    // console.log('notificationClick', this.userInfo.notificationEnabled);
    if(this.userInfo.notificationEnabled){
      this.helperService.disableNotification();
    }
    else{
      this.helperService.enableNotification();
    }
  }


  handleSubmit(event:Event){
    event.preventDefault();
    // console.log(this.name, this.userEmail, this.message);
    if(!this.name || !this.userEmail || !this.message){
      this.toastr.warning("Please Enter all the required fields!");
      return;
    }

    let data = {
      name: this.name,
      mail: this.userEmail,
      message: this.message,
      subject:"Message from Student Attendance Tracker"
    }
    this.helperService.startLoader();
    this.userService.contactMe(data).subscribe({
      next:(resp:any)=>{
        // console.log(resp);
        this.toastr.success("Message sent successfully!");
        this.name = "";
        this.userEmail = "";
        this.message = "";
        this.helperService.stopLoader();
      },
      error:(err:any)=>{
        console.log(err);
        this.toastr.error(err.error?.message);
        this.helperService.stopLoader();
      }
    })
  }



}
