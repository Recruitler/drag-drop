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


export interface DropDownItem {
  name: string;
  children?: DropDownItem[];
}


/**
 * @name Drag&Drop connected sorting group
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
  public list: DropDownItem[] = [
    {
      name: "Section 1",
      children: []
    },
    {
      name: "Section 2",
      children: [
        {
          name: "Section 2.1",
          children: []
        },
        {
          name: "Section 2.2",
          children: []
        },
        {
          name: "Section 2.3",
          children: []
        }
      ]
    },
    {
      name: "Section 3",
      children: [
        { name: "Section 3.1", children: [] },
        {
          name: "Section 3.2",
          children: [
            {
              name: "Section 3.2.1",
              children: []
            },
            {
              name: "Section 3.2.2",
              children: []
            },
            {
              name: "Section 3.2.3",
              children: [
                {
                  name: "Section 3.2.3.1",
                  children: []
                },
                {
                  name: "Section 3.2.3.2",
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: "Section 4",
          children: []
        },
        {
          name: "Section 5",
          children: []
        },
        {
          name: "Section 6",
          children: []
        },
      ]
    }
  ];


  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  public dls: CdkDropList[] = [];

  drop(event: CdkDragDrop<any>) {

    console.log(event.dropPoint);
    console.log(event)



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
    // console.log("isArray function called");
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