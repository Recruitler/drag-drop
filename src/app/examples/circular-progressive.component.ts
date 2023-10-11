import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  template: `
    <div class="progress-container">
      <svg viewBox="0 0 100 100">
        <circle class="progress-background" cx="50" cy="50" r="45"></circle>
        <circle class="progress-bar" cx="50" cy="50" r="45" [style.strokeDasharray]="circumference" [style.strokeDashoffset]="offset"></circle>
      </svg>
    </div>
  `,
  standalone: true,
  styles: [
    `
      .progress-container {
        position: relative;
        width: 100px;
        height: 100px;
      }
      .progress-background {
        fill: none;
        stroke: #ddd;
        stroke-width: 5;
      }
      .progress-bar {
        fill: none;
        stroke: #007bff;
        stroke-width: 5;
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        transition: stroke-dashoffset 0.25s;
        animation: rotate 1s linear infinite;
      }
      @keyframes rotate {
        100% {
          transform: rotate(270deg);
        }
      }
    `,
  ],
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