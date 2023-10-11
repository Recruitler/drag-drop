import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ExamplesComponent } from './examples/examples.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ExamplesComponent, RouterOutlet],
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Recruitler\'s drag-drop';
}
