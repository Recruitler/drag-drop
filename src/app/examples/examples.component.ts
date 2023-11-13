import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
// import {MatProgressSpinnerModule} from '@angular/material';
// MatProgressSpinnerModule
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
    MatPaginatorModule,
  ],
  providers: [DragDrop],
  standalone: true,
  styleUrls: ['./examples.component.scss'],
})
export class ExamplesComponent {

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



  reorderDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  // nestItemClass = "cdk-nest-dragdrop-item";

  //  TRANSFERRING ITEMS BETWEEN LISTS EXAMPLE - https://material.angular.io/cdk/drag-drop/overview#transferring-items-between-lists
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  transferDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  // List orientation - https://material.angular.io/cdk/drag-drop/overview#list-orientation
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];

  horizontalDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }



  pageMode: IPageMode = 'PAGINATION';

  dropdownTree: CdkDropDownItem[] = [
    {
      name: "Section 1",
    },
    {
      name: "Section 2",
      children: [
        {
          name: "Section 2.1",
          description: "This is a description about this section"

        },
        {
          name: "Section 2.2",
          description: "This is a description about this section"

        },
        {
          name: "Section 2.3",
          description: "This is a description about this section"

        }
      ]
    },
    {
      name: "Section 3",
      children: [
        {
          name: "Section 3.1",
          description: "This is a description about this section"
        },
        {
          name: "Section 3.2",
          description: "This is a description about this section",
          children: [
            {
              name: "Section 3.2.1",
              description: "This is a description about this section"

            },
            {
              name: "Section 3.2.2",
              description: "This is a description about this section"

            },
            {
              name: "Section 3.2.3",
              description: "This is a description about this section",

              children: [
                {
                  name: "Section 3.2.3.1",
                  description: "This is a description about this section",


                },
                {
                  name: "Section 3.2.3.2",
                  description: "This is a description about this section",


                }
              ]
            }
          ]
        },
      ]
    },
    {
      name: "Section 4",
      description: "This is a description about this section",


    },
    {
      name: "Section 5",
      description: "This is a description about this section",


    },
    {
      name: "Section 6",
      description: "This is a description about this section",


    },
  ];

  indexTree: CdkIndexTree;

  currentPage: number = 0;

  totalCount: number = 0;

  pageSize: number = 5;

  listItems: CdkDropDownItem[] = [];

  isLoading = false;

  onNestDragDropped(event: CdkNestDrop) {
    console.log('drag&drop event :>> ', event);



  }

  pageChanged(event: number) {
    this.isLoading = true;
    setTimeout(() => {
      const page: number = event;

      let startIndex = page * this.pageSize;
      let endIndex = Math.min(startIndex + this.pageSize - 1, this.totalCount - 1);

      const splittedTree = splitTree(this.indexTree, startIndex, endIndex);

      splittedTree.children && (this.listItems = splittedTree.children)

      splittedTree.children && (this.currentPage = page);

      this.isLoading = false;
    }, 1250);


  }

  onScrollNextPage(event: number) {
    console.log('event :>> ', event);
    this.isLoading = true;
    setTimeout(() => {
      const page: number = event + 1;

      let startIndex = 0;
      let endIndex = Math.min(page * this.pageSize + this.pageSize - 1, this.totalCount - 1);

      const splittedTree = splitTree(this.indexTree, startIndex, endIndex);

      splittedTree.children && (this.listItems = splittedTree.children)

      splittedTree.children && (this.currentPage = page);

      this.isLoading = false;

    }, 250);
  }

  ngAfterContentInit() {
    const tree = buildTree(this.dropdownTree);
    this.totalCount = getDecendantCount(tree) - 1;
    this.indexTree = constructCdkIndexTree(tree);

    const splittedTree = splitTree(this.indexTree, 0, this.pageSize - 1);

    splittedTree.children && (this.listItems = splittedTree.children)

    splittedTree.children && (this.currentPage = 0)

  }

  onPageUpdate(page: PageEvent) {
    console.log('page :>> ', page);
    this.listItems = this.dropdownTree.splice(page.pageIndex * page.pageSize, (page.pageIndex + 1) * page.pageSize - 1) ;
  }
}
