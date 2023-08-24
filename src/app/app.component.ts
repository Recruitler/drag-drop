import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SortableComponent } from 'projects/sortable/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [SortableComponent, RouterOutlet],
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'drag-drop';
}
