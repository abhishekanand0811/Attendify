import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper/helper.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
isLoggedIn: any;

  constructor(public router: Router, @Inject(HelperService)private helperService: HelperService){
    this.helperService.currentMessage.subscribe({
      next:msg=>{
        if(msg == 'userLoggedIn'){
          this.getLoginStatus();
        }
      }
    })
  }

  openMenuToggle = false;
  loginStatus = false;

  ngOnInit() {
    this.getLoginStatus();
  }

  getLoginStatus() {
    this.loginStatus = this.helperService.getLoginStatus();
  }

  gotoLogin(){
    this.router.navigateByUrl('/login');
  }

  gotoUser(){
    this.helperService.logOut();
    this.getLoginStatus();
    this.openMenuToggle = false;
  }

  openMenu(){
    this.openMenuToggle = true;
  }

  closeMenu(){
    this.openMenuToggle = false;
  }

  closeMenuOutside(event:Event){
    let target = event.target as HTMLElement;
    // console.log(event.target);
    if(target.classList.contains('outer-box')){
      this.openMenuToggle = false;
    }
  }

  gotoDashboard(){
    this.router.navigateByUrl('/dashboard');
    this.openMenuToggle = false;
  }

  gotoProfile(){
    this.router.navigateByUrl('/profile');
    this.openMenuToggle = false;
  }

  gotoHome(){
    this.router.navigateByUrl('/');
    this.openMenuToggle = false;
  }
}
