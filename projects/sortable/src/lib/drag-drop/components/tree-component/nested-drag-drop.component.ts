import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef, ViewChildren, Input, QueryList } from '@angular/core';
import { asapScheduler } from 'rxjs';

import { CdkDragDrop, CdkDragNest } from '../../drag-events';

import { CdkDrag } from '../../directives/drag';
import { CdkDragHandle } from '../../directives/drag-handle';
import { CdkDragPlaceholder } from '../../directives/drag-placeholder';
import { CdkDragPreview } from '../../directives/drag-preview';
import { CdkDropList } from '../../directives/drop-list';
import { CdkDropListGroup } from '../../directives/drop-list-group';
import { DragDrop } from '../../drag-drop';
import { NgClass } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  moveItemInArray,
  transferArrayItem,
} from '../../drag-utils';

import { constructCdkIndexTree, getDecendantCount, getTotalCount, splitTree } from '../../drag-drop-tree';

import { CdkIndexTree, CdkDropDownItem } from '../../drag-drop-tree';


const TAG = "nested-drag-drop.component.ts";

/**
 * @value Drag&Drop connected sorting group
 */
@Component({
  selector: 'nested-drag-drop',
  templateUrl: './nested-drag-drop.component.html',
  styleUrls: ['nested-drag-drop.component.scss'],
  standalone: true,
  providers: [DragDrop],
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
    NgClass,
    MatPaginatorModule
  ],
})

export class CdkNestedDragDropComponent {


  @Input('cdkNestedDropDownData')
  itemList: CdkDropDownItem[] = [];

  @Input('cdkListItemTemplate')
  itemTemplate!: TemplateRef<any>;

  @Input('cdkPlaceholderTemplate')
  placeholderTemplate!: TemplateRef<any>;


  @Input('cdkPageTotalItem') totalCount: number = 0;
  @Input('cdkPageCurrentIndex') currentPage: number = 0;
  @Input('cdkPageSize') pageSize: number = 0;

  @Output('cdkDragDropped') readonly dropped: EventEmitter<CdkDragDrop<any>> = new EventEmitter<
    CdkDragDrop<any>
  >();

  @Output('cdkPageChanged') readonly pageChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  dropLists: CdkDropList[] = [];


  drop(event: CdkDragDrop<any>) {
    this.dropped.emit(event);

    if (event.previousContainer === event.container) {
      let nestInfo = event.nestInfo;

      if (nestInfo) {
        let listData: CdkDropDownItem[] = event.container.data;

        if (nestInfo.nestIndex < listData.length && nestInfo.nestIndex >= 0) {
          let targetItem = listData[nestInfo.nestIndex];
          let targetChildren = targetItem?.children ? targetItem.children : [];
          transferArrayItem(
            event.container.data,
            targetChildren,
            event.previousIndex,
            targetChildren.length
          );

          targetItem.children = targetChildren;
        }
      } else {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    } else {
      let nestInfo = event.nestInfo;

      if (nestInfo) {
        let listData: CdkDropDownItem[] = event.container.data;

        if (nestInfo.nestIndex < listData.length && nestInfo.nestIndex >= 0) {
          let targetItem = listData[nestInfo.nestIndex];
          let targetChildren = targetItem?.children ? targetItem.children : [];
          transferArrayItem(
            event.previousContainer.data,
            targetChildren,
            event.previousIndex,
            targetChildren.length
          );
          targetItem.children = targetChildren;
        }
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  nest(event: CdkDragNest<any>) { }

  isArray(item: any): boolean {
    return Array.isArray(item);
  }

  ngAfterViewInit() {
    const ldls: CdkDropList[] = [];

    this.dlq.forEach((dl) => {
      ldls.push(dl)
    });

    asapScheduler.schedule(() => { this.dropLists = ldls; });

  }

  onPageChanged(event: PageEvent) {

    this.pageChanged.emit(event.pageIndex);

  }
}

/**  
Copyright 2019 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license 
*/