import { Component, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { 
  CdkDrag, 
  CdkDragPlaceholder, 
  CdkDropList, 
  CdkDropListGroup,
  CdkNestDrop, 
  CdkDropDownItem, 
  CdkNestedDragDropComponent,
  DragDrop,
  CdkDragDrop 
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  imports: [
    NgTemplateOutlet,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CdkDragPlaceholder,
    CdkNestedDragDropComponent,
  ],
  providers: [DragDrop],
  standalone: true,
})
export class ExamplesComponent implements OnInit {
  currentPage: number = 0;
  pageSize: number = 10;
  listItems: CdkDropDownItem[] = [];
  isLoading = false;

  // Example nested tree data structure for dedicated component
  dropdownTree: CdkDropDownItem[] = [
    {
      name: 'Section 1',
    },
    {
      name: 'Section 2',
      children: [
        {
          name: 'Section 2.1',
          description: 'This is a description about this section',
        },
        {
          name: 'Section 2.2',
          description: 'This is a description about this section',
        },
      ],
    },
  ];

  // Example data for custom implementation
  customItems = [
    {
      id: '1',
      name: 'Item 1',
      children: [
        { id: '1.1', name: 'Item 1.1' },
        { id: '1.2', name: 'Item 1.2' },
      ],
    },
    {
      id: '2',
      name: 'Item 2',
      children: [
        { id: '2.1', name: 'Item 2.1' },
        { id: '2.2', name: 'Item 2.2' },
      ],
    },
  ];

  constructor() {
    this.listItems = this.dropdownTree;
  }

  ngOnInit(): void {}

  // Handler for dedicated component
  onNestDragDropped(event: CdkNestDrop): void {
    // Handle the nested drag drop event
    console.log('Nested drag dropped:', event);
  }

  onScrollNextPage(event: any): void {
    // Handle scroll event for pagination
    console.log('Scroll next page:', event);
  }

  // Handlers for custom implementation
  onCustomDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      // Move within the same container
      const items = event.container.data;
      const item = items[event.previousIndex];
      items.splice(event.previousIndex, 1);
      items.splice(event.currentIndex, 0, item);
    } else {
      // Move between containers (nesting/unnesting)
      const item = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(event.currentIndex, 0, item);
    }
  }

  isDropAllowed(item: any, target: any): boolean {
    // Add custom validation logic here
    // For example, prevent nesting beyond 3 levels
    return true;
  }
}
