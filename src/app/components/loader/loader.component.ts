import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { HelperService } from '../../services/helper/helper.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  showLoader = false;

  constructor(@Inject(HelperService)private helperService:HelperService) {
    this.helperService.currentMessage.subscribe({
      next:msg=>{
        if(msg == 'start-loader'){
          this.showLoader = true;
        }
        else if(msg == 'stop-loader'){
          this.showLoader = false;
        }
      }
    })
  }

}
