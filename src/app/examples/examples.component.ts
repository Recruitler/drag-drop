import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// our lib - a custom version of https://github.com/angular/components/tree/main/src/cdk/drag-drop
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup,
  DragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkNestedDragDropComponent,
  CdkDropDownItem,
  splitTree,
  buildTree,
  constructCdkIndexTree,
  CdkIndexTree,
  getTotalCount,
  getDecendantCount,
  CdkNestDrop,
  swapTreeNodes,
  nestTreeNode,
  IPageMode,
} from 'projects/sortable/src/lib/drag-drop';

import { CircularProgressComponent } from './circular-progressive.component';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  imports: [
    NgFor,
    NgIf,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
    CdkNestedDragDropComponent,
    CircularProgressComponent,
  ],
  providers: [DragDrop],
  standalone: true,
  styleUrls: ['./examples.component.scss'],
})
export class ExamplesComponent implements OnInit {
  // Reordering lists example - https://material.angular.io/cdk/drag-drop/overview#reordering-lists
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker',
  ];
  indexTree: CdkIndexTree;
  currentPage: number = 0;
  totalCount: number = 0;
  pageSize: number = 10;
  listItems: CdkDropDownItem[] = [];
  isLoading = false;
  // nestItemClass = "cdk-nest-dragdrop-item";

  // List orientation - https://material.angular.io/cdk/drag-drop/overview#list-orientation
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];

  // TRANSFERRING ITEMS BETWEEN LISTS EXAMPLE - https://material.angular.io/cdk/drag-drop/overview#transferring-items-between-lists
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  pageMode: IPageMode = 'VIRTUAL-SCROLL';

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
    let items = [];
    let i, k, subItems = [];

    for (i = 0; i < 100; i++) {
      subItems = [];
      for (k = 0; k < 0; k++) {
        let item: any = {
          name: `Section ${i + 1}.${k + 1}`,
          description: 'This is a description about this section',
        };
        // if ( i % 2 == 0 ) {
        //   item = {...item, draggingDisabled: true }
        // }
        subItems.push(item);
      }
      items.push({
        name: `Section ${i + 1}`,
        children: subItems,
      });
    }
    this.dropdownTree = items;
  }

  ngAfterContentInit() {
    const tree = buildTree(this.dropdownTree);
    this.totalCount = getDecendantCount(tree) - 1;
    this.indexTree = constructCdkIndexTree(tree);
    const splittedTree = splitTree(this.indexTree, 0, this.pageSize - 1);

    splittedTree.children && (this.listItems = splittedTree.children);
    splittedTree.children && (this.currentPage = 0);
  }

  onNestDragDropped(event: CdkNestDrop) {
    console.log('drag&drop event :>> ', event);
  }

  reorderDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  transferDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  horizontalDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  pageChanged(event: number) {
    this.isLoading = true;

    setTimeout(() => {
      const page: number = event;
      let startIndex = page * this.pageSize;
      let endIndex = Math.min(
        startIndex + this.pageSize - 1,
        this.totalCount - 1
      );

      const splittedTree = splitTree(this.indexTree, startIndex, endIndex);
      splittedTree.children && (this.listItems = splittedTree.children);
      splittedTree.children && (this.currentPage = page);
      this.isLoading = false;
    }, 1250);
  }

  onScrollNextPage(event: Event) {
    this.isLoading = true;

    setTimeout(() => {
      // const page: number = this.listItems.length / this.pageSize + 2;
      this.currentPage = this.currentPage + 1;
      let page = this.currentPage;

      let startIndex = 0;
      let endIndex = Math.min(
        page * this.pageSize + this.pageSize - 1,
        this.totalCount - 1
      );

      const splittedTree = splitTree(this.indexTree, startIndex, endIndex);

      // what is this?
      if (splittedTree.children && splittedTree.children.length > this.listItems.length) {
        this.listItems = splittedTree.children;
      }

      this.isLoading = false;
    }, 250);
  }


  // what is PageEvent?
  // onPageUpdate(page: PageEvent) {
  onPageUpdate(page: any) {
    this.listItems = this.dropdownTree.splice(page.pageIndex * page.pageSize, (page.pageIndex + 1) * page.pageSize - 1);
  }
}
