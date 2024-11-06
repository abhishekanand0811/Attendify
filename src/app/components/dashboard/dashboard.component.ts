import { Component, inject } from '@angular/core';
import { AttendanceService } from '../../services/attendance/attendance.service';
import { HelperService } from '../../services/helper/helper.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private attendanceService = inject(AttendanceService);
  private helperService = inject(HelperService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  userDetails = this.helperService.getUserDetails();
  attendanceSummary:any;
  newSemester:any = false;
  academicYearList: any = [];
  selectedAcademicYear: string = '';
  selectedSemester: number = 0;
  

  ngOnInit() {
    // this.userId = ;
    // console.log(this.userDetails.userId);
    this.fetchAttendanceSummary();
    this.prepareAcademicYearList();
  }

  fetchAttendanceSummary() {
    this.helperService.startLoader();
    this.attendanceService.getAttendanceSummary(this.userDetails.userId).subscribe({
      next:(resp) => {
        // console.log(resp);
        this.attendanceSummary = resp;
        this.helperService.stopLoader();
      },
      error:(err) => {
        console.log(err.status);
        if(err.status === 401 ){
          this.helperService.logOut();
          this.toastr.error("Session Expired! Please Log in again!");
          this.router.navigateByUrl('/login');
        }
        this.helperService.stopLoader();
      }
    });
  }

  addSemester(){
    this.newSemester = true;
  }

  prepareAcademicYearList() {
    let year= new Date().getFullYear();
    // console.log(year);
    this.academicYearList.push((year-2)+'-'+(year-1));
    this.academicYearList.push((year-1)+'-'+year);
    this.academicYearList.push(year+'-'+(year+1));
    this.academicYearList.push((year+1)+'-'+(year+2));
  }

  createSemester(event:Event){
    event.preventDefault();
    // console.log(this.selectedAcademicYear, this.selectedSemester);
    if(!this.selectedAcademicYear ||!this.selectedSemester){
      this.toastr.warning("Please select valid academic year and semester!");
      return;
    }

    let data = {
      academicYear: this.selectedAcademicYear,
      semester: this.selectedSemester,
      userId: this.userDetails.userId,
      subjectList : [
        {
          subjectId : uuidv4(),
          "name" : "Subject - 1",
          "presentCount" : 0,
          "totalCount" : 0
        }
      ]
    }

    this.helperService.startLoader();

    this.attendanceService.updateAttendance(data).subscribe({
      next:(resp)=>{
        // console.log(resp);
        this.toastr.success("New Semester Added successfully!");
        this.cancelSemester();
        this.helperService.stopLoader();
        this.fetchAttendanceSummary();
      },
      error:(err)=>{
        console.log(err);
        if(err.status === 401 ){
          this.helperService.logOut();
          this.toastr.error("Session Expired! Please Log in again!");
          this.router.navigateByUrl('/login');
        }
        else{
          this.toastr.error(err.error?.message);
        }
        this.helperService.stopLoader();
        this.cancelSemester();
      }
    })

  }

  cancelSemester(){
    this.selectedAcademicYear = '';
    this.selectedSemester = 0;
    this.newSemester = false;
  }

  openAttendance(sem:any){
    // console.log(sem);
    this.router.navigateByUrl(`/attendance/${sem.attendanceId}`);
  }

  sideMenu(event:Event, attendance:any, year:any){
    event.stopPropagation();
    // console.log("side Menu Click", attendance, year);
    if(!confirm(`Are you sure to delete Semester: ${attendance.semester} of ${year.academicYear}?`)){
      return;
    }

    this.helperService.startLoader();
    this.attendanceService.deleteAttendance(attendance.attendanceId).subscribe({
      next:(resp)=>{
        // console.log(resp);
        this.toastr.success("Semester deleted successfully!");
        this.helperService.stopLoader();
        this.fetchAttendanceSummary();
      },
      error:(err)=>{
        console.log(err);
        if(err.status === 401 ){
          this.helperService.logOut();
          this.toastr.error("Session Expired! Please Log in again!");
          this.router.navigateByUrl('/login');
        }
        else{
          this.toastr.error(err.error?.message);
        }
        this.helperService.stopLoader();
      }
    })
  }

}
