import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance/attendance.service';
import { HelperService } from '../../services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartComponent],
  templateUrl: './attendance-page.component.html',
  styleUrl: './attendance-page.component.scss'
})
export class AttendancePageComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  attendanceService = inject(AttendanceService);
  helperService = inject(HelperService);
  toastr = inject(ToastrService);

  attendanceId: string | null = '';
  attendanceDetails: any;
  addSubject: boolean = false;
  subjectName:string = '';
  presentCount:number = 0;
  absentCount:number = 0;

  userDetails:any = this.helperService.getUserDetails();
  modalDisplay: string = '';
  selectedSubjectId: any;

  labeldata: any[] = [];
  realdata: number[] = [];
  colordata: string[] = [];
  showChart: boolean = false;

  modifiedDate:any;

  ngOnInit(){
    this.route.paramMap.subscribe((params: ParamMap) => {
        this.attendanceId = params.get('attendanceId');
    });
    this.fetchAttendanceDetails();
    // console.log(this.userDetails.userId);
  }

  fetchAttendanceDetails(){
    if(!this.attendanceId){
      this.toastr.warning("Attendance ID is not Valid");
    }
    this.helperService.startLoader();
    this.attendanceService.getAttendanceById(this.attendanceId).subscribe({
      next:(response: any) => {
      // console.log(response);
      this.attendanceDetails = response
      this.attendanceDetails.averagePercentage = this.attendanceDetails.averagePercentage.toFixed(2);
      this.attendanceDetails.userId = this.userDetails.userId;
      this.modifiedDate = this.attendanceDetails.lastModifiedDate?.slice(0,10);
      console.log(this.modifiedDate);
      this.helperService.stopLoader();
      this.prepareChartData();
      },
      error:(err)=>{
        console.log(err);
        if(err.status === 401 ){
          this.helperService.logOut();
          this.toastr.error("Session Expired! Please Log in again!");
          this.router.navigateByUrl('/login');
        }
        this.helperService.stopLoader();
      }
    });
  }

  getProgressCircleStyle(percent:number){
    return {'background': `conic-gradient(#007BFF ${percent*3.6}deg, #b9b9b9 0deg)`}
  }

  addNewSubject(){
    this.addSubject = true;
    this.modalDisplay = 'add';
  }

  cancelAddSubject(){
    this.addSubject = false;
    this.subjectName = '';
    this.presentCount = 0;
    this.absentCount = 0;
    this.modalDisplay = '';
    this.selectedSubjectId = null;
  }

  createNewSubject(){
    let data = {
      name: this.subjectName,
      presentCount: this.presentCount,
      totalCount: this.presentCount + this.absentCount,
      percentage: (this.presentCount + this.absentCount) === 0 ? 0 : (this.presentCount / (this.presentCount + this.absentCount)) * 100,
      subjectId: uuidv4()
    }

    // console.log(data, this.attendanceDetails);
    this.attendanceDetails.subjectList.push(data);
    this.helperService.startLoader();
    this.attendanceService.updateAttendance(this.attendanceDetails).subscribe({
      next:(resp:any)=>{
        // console.log(resp);
        this.toastr.success("New Subject Added successfully!");
        this.helperService.stopLoader();
        this.cancelAddSubject();
        this.prepareChartData();
        this.updateOverallPercentage();
      },
      error:(err:any)=>{
        console.log(err);
        this.toastr.error(err.error?.message);
        this.helperService.stopLoader();
        const index = this.attendanceDetails.subjectList.indexOf(data, 0);
        if (index > -1) {
          this.attendanceDetails.subjectList.splice(index, 1);
        }
      }
    });
  }

  updateAttendance(){
    this.helperService.startLoader();
    this.attendanceService.updateAttendance(this.attendanceDetails).subscribe({
      next:(resp:any)=>{
        // console.log(resp);
        // this.toastr.success("New Subject Added successfully!");
        this.helperService.stopLoader();
        this.cancelAddSubject();
        this.prepareChartData();
      },
      error:(err:any)=>{
        console.log(err);
        this.toastr.error(err.error?.message);
        this.helperService.stopLoader();
      }
    });
  }

  onAddPresent(subject:any,type:number){
    // console.log(subject);
    try{
      this.attendanceDetails.subjectList.forEach((element:any) => {
        if(element.subjectId === subject.subjectId){
          if(type){
            element.presentCount++;
            element.totalCount++;
          }
          else{
            if(element.presentCount !== 0){
              element.presentCount--;
              element.totalCount--;
            }
            else{
              this.toastr.warning("Invalid Number of Hours for the Subject!");
              throw new Error("Invalid Number of Hours for the Subject!");
            }
          }
          this.updatePercentage(element);
        }
      });
      // console.log(this.currentAttendance);
      this.updateAttendance();
    }
    catch(e){
      // console.log(e);
    }
  }

  onAddAbsent(subject:any,type:number){
    // console.log(subject);
    try{
      this.attendanceDetails.subjectList.forEach((element:any) => {
        if(element.subjectId === subject.subjectId){
          if(type){
            element.totalCount++;
          }
          else{
            if((element.totalCount - element.presentCount)!==0){
              element.totalCount--;
            }
            else{
              this.toastr.warning("Invalid Number of Hours for the Subject!");
              throw new Error("Invalid Number of Hours for the Subject!");
            }
          }
          this.updatePercentage(element);
        }
      });
      // console.log(this.currentAttendance);
      this.updateAttendance();
    }
    catch(e){
      // console.log(e);
    }
  }

  updatePercentage(element:any){
    if(element.totalCount === 0){
      element.percentage = 0;
    }
    else{
      element.percentage = (element.presentCount / element.totalCount) * 100;
    }
    this.updateOverallPercentage();
  }

  updateOverallPercentage(){
    let percentage = 0;
    let total = 0;
    this.attendanceDetails.subjectList.forEach((element:any) =>{
      percentage += element.percentage;
      total += 1;
    });
    this.attendanceDetails.averagePercentage = percentage / total;
    this.attendanceDetails.averagePercentage = this.attendanceDetails.averagePercentage.toFixed(2);
  }

  editSubject(subject:any){
    this.addSubject = true;
    this.selectedSubjectId = subject.subjectId;
    this.subjectName = subject.name;
    this.presentCount = subject.presentCount;
    this.absentCount = subject.totalCount - subject.presentCount;
    this.modalDisplay = 'edit';
  }

  updateSubject(){
    this.attendanceDetails.subjectList.forEach((subject:any)=>{
      if(subject.subjectId === this.selectedSubjectId){
        subject.name = this.subjectName;
        subject.presentCount = this.presentCount;
        subject.totalCount = this.presentCount + this.absentCount;
        subject.percentage = (subject.presentCount / subject.totalCount) * 100;
      }
    });
    // console.log(this.attendanceDetails);
    this.updateAttendance();
    this.updateOverallPercentage();
    this.cancelAddSubject();
  }

  createSubject(event:Event){
    event.preventDefault();
    // console.log(this.subjectName, this.presentCount, this.absentCount);
    if(!this.subjectName){
      this.toastr.warning("Please fill all required fields!");
      return;
    }

    if(this.modalDisplay === 'edit'){
      this.updateSubject()
    }
    else if(this.modalDisplay === 'add'){
      this.createNewSubject()
    }
  }

  deleteSubject(subject:any){
    if(!window.confirm("Are you sure you want to delete this subject: " + subject.name)){
      return;
    }
    // console.log(subject);
    this.attendanceDetails.subjectList = this.attendanceDetails.subjectList.filter((s:any) => s.subjectId!== subject.subjectId);
    this.updateAttendance();
    this.updateOverallPercentage();
    this.toastr.success("Subject deleted successfully!");
  }

  prepareChartData(){
    this.showChart = false;
    this.labeldata = [];
    this.realdata = [];
    this.colordata = [];
    let backgroundColorTemplate = {'0-75':'#f75050','76-100':'#5252eb'};
    
    this.attendanceDetails.subjectList.forEach((sub:any)=>{
      let bgColor;
      if(parseInt(sub.percentage)>=75){
        bgColor = backgroundColorTemplate['76-100']
      }
      else{
        bgColor = backgroundColorTemplate['0-75']
      }
      this.labeldata.push(sub.name.slice(0,15));
      this.realdata.push(sub.percentage);
      this.colordata.push(bgColor);
    });
    
    this.showChart = true;
    // console.log(this.chartData);
  }

  updateModifiedDate(event:Event){
    console.log(event);
    console.log(this.modifiedDate);
    this.attendanceDetails.lastModifiedDate = this.modifiedDate;
    console.log(this.attendanceDetails);
    this.updateAttendance();
  }

}
