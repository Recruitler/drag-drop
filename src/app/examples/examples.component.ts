import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkNestDrop, CdkDropDownItem, CdkNestedDragDropComponent } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  imports: [
    CdkDrag,
    CdkNestedDragDropComponent,
  ],
  standalone: true,
})
export class ExamplesComponent implements OnInit {
  currentPage: number = 0;
  pageSize: number = 10;
  listItems: CdkDropDownItem[] = [];
  isLoading = false;
  pageMode = false;

  // Example nested tree data structure
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
        {
          name: 'Section 2.3',
          description: 'This is a description about this section',
        },
      ],
    },
    {
      name: 'Section 3',
      children: [
        {
          name: 'Section 3.1',
          description: 'This is a description about this section',
        },
        {
          name: 'Section 3.2',
          description: 'This is a description about this section',
          children: [
            {
              name: 'Section 3.2.1',
              description: 'This is a description about this section',
            },
            {
              name: 'Section 3.2.2',
              description: 'This is a description about this section',
            },
            {
              name: 'Section 3.2.3',
              description: 'This is a description about this section',
              children: [
                {
                  name: 'Section 3.2.3.1',
                  description: 'This is a description about this section',
                },
                {
                  name: 'Section 3.2.3.2',
                  description: 'This is a description about this section',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Section 4',
      description: 'This is a description about this section',
    },
    {
      name: 'Section 5',
      description: 'This is a description about this section',
    },
    {
      name: 'Section 6',
      description: 'This is a description about this section',
    },
  ];

  ngOnInit(): void {
    this.listItems = this.dropdownTree;
  }

  onNestDragDropped(event: CdkNestDrop): void {
    // The component handles the array manipulation internally
    // We just need to handle any additional logic here
    console.log('Item dropped:', event.item);
    console.log('New parent:', event.parent);
    console.log('Position:', event.position);
    console.log('Is nesting:', event.isNesting);
  }

  onScrollNextPage(event: Event): void {
    this.isLoading = true;
    setTimeout(() => {
      this.currentPage++;
      this.isLoading = false;
    }, 250);
  }
}
