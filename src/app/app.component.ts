import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExamplesComponent } from './examples/examples.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ExamplesComponent],
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Recruitler\'s drag-drop';
  private darkModeMediaQuery: MediaQueryList;
  
  constructor() {
    this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.updateTheme(this.darkModeMediaQuery);
  }

  ngOnInit(): void {
    // Add event listener for theme changes
    this.darkModeMediaQuery.addEventListener('change', this.handleThemeChange);
  }

  ngOnDestroy(): void {
    // Clean up event listener
    this.darkModeMediaQuery.removeEventListener('change', this.handleThemeChange);
  }

  private handleThemeChange = (e: MediaQueryListEvent): void => {
    this.updateTheme(e);
  };

  private updateTheme(mediaQuery: MediaQueryList | MediaQueryListEvent): void {
    if (mediaQuery.matches) {
      // Dark mode
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#ffffff';
      
      // Update SVGs
      const rocketSmokePath = document.querySelector('#rocket-smoke path');
      const cloudsPath = document.querySelector('#clouds path');
      
      if (rocketSmokePath instanceof SVGPathElement) {
        rocketSmokePath.setAttribute('fill', '#434343');
      }
      
      if (cloudsPath instanceof SVGPathElement) {
        cloudsPath.setAttribute('fill', '#434343');
      }
    } else {
      // Light mode
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
      
      // Update SVGs
      const rocketSmokePath = document.querySelector('#rocket-smoke path');
      const cloudsPath = document.querySelector('#clouds path');
      
      if (rocketSmokePath instanceof SVGPathElement) {
        rocketSmokePath.setAttribute('fill', '#f5f5f5');
      }
      
      if (cloudsPath instanceof SVGPathElement) {
        cloudsPath.setAttribute('fill', '#f5f5f5');
      }
    }
  }
}
