import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  template: `
    <div class="loader" style="display: flex;width: 60px; height: 60px">
      <div class="small-loader" style="margin: auto; width: 30px; height: 30px"></div>
    </div>
  `,
  standalone: true,
  styleUrls: ['./circular-progressive.component.scss']
})
export class CircularProgressComponent {
  circumference = 2 * Math.PI * 45;
  offset = this.circumference;

  constructor() {
    setInterval(() => {
      this.offset -= this.circumference / 10;
      if (this.offset < 0) {
        this.offset = this.circumference;
      }
    }, 500);
  }
}