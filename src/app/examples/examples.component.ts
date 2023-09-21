import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

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
} from 'projects/sortable/src/lib/drag-drop';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  imports: [
    NgFor,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
    CdkNestedDragDropComponent
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
  dropdownTree: CdkDropDownItem[] = [
    {
      value: "Section 1",

    },
    {
      value: "Section 2",
      children: [
        {
          value: "Section 2.1",

        },
        {
          value: "Section 2.2",

        },
        {
          value: "Section 2.3",

        }
      ]
    },
    {
      value: "Section 3",
      children: [
        { value: "Section 3.1", },
        {
          value: "Section 3.2",
          children: [
            {
              value: "Section 3.2.1",

            },
            {
              value: "Section 3.2.2",

            },
            {
              value: "Section 3.2.3",
              children: [
                {
                  value: "Section 3.2.3.1",

                },
                {
                  value: "Section 3.2.3.2",

                }
              ]
            }
          ]
        },
      ]
    },
    {
      value: "Section 4",

    },
    {
      value: "Section 5",

    },
    {
      value: "Section 6",

    },
  ];

  onNestDragDropped(event: CdkDragDrop<any>) {
    console.log("nested drop event", event);
  }

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

}
