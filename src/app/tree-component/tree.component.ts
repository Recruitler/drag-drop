import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { asapScheduler, asyncScheduler } from 'rxjs';

import { 
  CdkDragDrop, 
  CdkDrag, 
  CdkDragHandle, 
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList, 
  CdkDropListGroup, 
  moveItemInArray, 
  transferArrayItem, 
  CdkDragEnter, 
  CdkDragExit, 
  CdkDragStart,
  DragDrop, 
} from 'projects/sortable/src/lib/drag-drop';

/**
 * @title Drag&Drop connected sorting group
 */
@Component({
  selector: 'tree-component',
  templateUrl: './tree.component.html',
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
  ],
  providers: [DragDrop],
  standalone: true,
  styleUrls: ['tree.component.scss'],
})

export class TreeComponent {
  todo = [
    'Get to work',
    [
      'Get up',
      [
        'A',
        'B',
        'C',
      ],
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ],
    [
      'Preare for work',
      'Drive to office',
      'Üark car'
    ],
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  public dls: CdkDropList[] = [];

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  isArray(item: any): boolean {
    return Array.isArray(item);
  }

  ngAfterViewInit() {
    const ldls: CdkDropList[] = [];

    this.dlq.forEach((dl) => {
      console.log('found DropList ' + dl.id)
      ldls.push(dl)
    });

    asapScheduler.schedule(() => { this.dls = ldls; });
  }

}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */