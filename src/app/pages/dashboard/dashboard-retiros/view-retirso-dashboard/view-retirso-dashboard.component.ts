import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
  selector: 'app-view-retirso-dashboard',
  templateUrl: './view-retirso-dashboard.component.html',
  styleUrls: ['./view-retirso-dashboard.component.css'],
  animations: fuseAnimations
})
export class ViewRetirsoDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

}
