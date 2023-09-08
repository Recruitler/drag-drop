import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ExamplesComponent } from './examples/examples.component';
import { TreeComponent } from './tree-component/tree.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ExamplesComponent, TreeComponent, RouterOutlet],
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Recruitler\'s drag-drop';
}
