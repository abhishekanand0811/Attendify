import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {

  mychar: any;

  @Input()labeldata: any[] = [];
  @Input()realdata: number[] = [];
  @Input()colordata: string[] = [];
  
  ngOnInit(){
    this.showBarChart();
  }

  ngOnChanges(changes: SimpleChanges){
    // console.log(this.mychar);
    if(this.mychar){
      this.mychar.destroy();
    }
    this.showBarChart();
  }

  showBarChart(){
    // console.log(this.labeldata, this.realdata, this.colordata);
    if(this.mychar){
      this.mychar.destroy();
    }
    this.mychar = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.labeldata,
        datasets: [
          {
            label: 'Percentage',
            data: this.realdata,
            backgroundColor: this.colordata,
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
          }
        }
      },

    });
  }


}
