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
  CdkDragNest,
} from 'projects/sortable/src/lib/drag-drop';


export interface DropDownItem {
  name: string;
  children?: DropDownItem[];
}

const TAG = "tree.component.ts";

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

    },
    {
      name: "Section 2",
      children: [
        {
          name: "Section 2.1",

        },
        {
          name: "Section 2.2",

        },
        {
          name: "Section 2.3",

        }
      ]
    },
    {
      name: "Section 3",
      children: [
        { name: "Section 3.1", },
        {
          name: "Section 3.2",
          children: [
            {
              name: "Section 3.2.1",

            },
            {
              name: "Section 3.2.2",

            },
            {
              name: "Section 3.2.3",
              children: [
                {
                  name: "Section 3.2.3.1",

                },
                {
                  name: "Section 3.2.3.2",

                }
              ]
            }
          ]
        },
      ]
    },
    {
      name: "Section 4",

    },
    {
      name: "Section 5",

    },
    {
      name: "Section 6",

    },
  ];


  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  public dls: CdkDropList[] = [];

  drop(event: CdkDragDrop<any>) {


    if (event.previousContainer === event.container) {
      let nestInfo = event.nestInfo;

      console.log(TAG, nestInfo);
      if (nestInfo) {
        let listData: DropDownItem[] = event.container.data;

        console.log(TAG, listData);

        if (nestInfo.nestIndex < listData.length && nestInfo.nestIndex >= 0) {
          let targetItem = listData[nestInfo.nestIndex];
          let targetChildren = targetItem?.children ? targetItem.children : [];
          // targetChildren.push({name: ""});
          transferArrayItem(event.container.data,
            targetChildren,
            event.previousIndex,
            targetChildren.length);

          targetItem.children = targetChildren;
          console.log(TAG, targetChildren);

        }
      } else {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    } else {
      let nestInfo = event.nestInfo;

      console.log(TAG, nestInfo);

      if (nestInfo) {
        let listData: DropDownItem[] = event.container.data;

        console.log(TAG, listData);

        if (nestInfo.nestIndex < listData.length && nestInfo.nestIndex >= 0) {
          let targetItem = listData[nestInfo.nestIndex];
          let targetChildren = targetItem?.children ? targetItem.children : [];
          // targetChildren.push({name: ""});
          transferArrayItem(event.previousContainer.data,
            targetChildren,
            event.previousIndex,
            targetChildren.length);

          targetItem.children = targetChildren;
          console.log(TAG, targetChildren);

        }
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }

    }
  }

  nest(event: CdkDragNest<any>) {
    console.log("R2M", "nest ", event);
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