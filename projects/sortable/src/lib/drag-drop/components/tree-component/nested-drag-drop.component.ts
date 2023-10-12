import { NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Output, ElementRef, afterRender, TemplateRef, ViewChildren, ViewChild, Input, QueryList } from '@angular/core';
import { asapScheduler } from 'rxjs';

import { CdkDragDrop, CdkDragNest, CdkNestDrop } from '../../drag-events';

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

import { buildTree, constructCdkIndexTree, getDecendantCount, getTotalCount, splitTree } from '../../drag-drop-tree';

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
    MatPaginatorModule,
    NgStyle
  ],
})
export class CdkNestedDragDropComponent {


  @Input('cdkNestedDropDownData')
  itemTreeList: CdkDropDownItem[] = [];

  @Input('cdkListItemTemplate')
  itemTemplate!: TemplateRef<any>;

  @Input('cdkPlaceholderTemplate')
  placeholderTemplate!: TemplateRef<any>;

  @Input('cdkDefaultPagination') paginationDefault = false;
  @Input('cdkPageTotalItem') totalCount: number = 0;
  @Input('cdkPageCurrentIndex') currentPage: number = 0;
  @Input('cdkPageSize') pageSize: number = 0;

  @Output('cdkDragDropped') readonly dropped: EventEmitter<CdkNestDrop> = new EventEmitter<
    CdkNestDrop
  >();

  @Output('cdkPageChanged') readonly pageChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  @Output('cdkScrollNextPage') readonly scrollNextPage: EventEmitter<number> = new EventEmitter<
    number
  >();

  @ViewChild('scrollBox') scrollBox!: ElementRef<HTMLElement>;
  @ViewChild('scrollGap') scrollGap!: ElementRef<HTMLElement>;
  @ViewChild('scrollContent') scrollContent!: ElementRef<HTMLElement>;




  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  dropLists: CdkDropList[] = [];

  dropGutterSize = 0;

  indexTree: CdkIndexTree;

  drop(event: CdkDragDrop<any>) {

    let prevListData: CdkDropDownItem[] = event.previousContainer.data;
    let curListData: CdkDropDownItem[] = event.container.data;

    const previousIndex = prevListData.length > 0 && prevListData[0]._isEmpty == true ? event.previousIndex + 1 : event.previousIndex;
    const currentIndex = curListData.length > 0 && curListData[0]._isEmpty == true ? event.currentIndex + 1 : event.currentIndex;
    let nestIndex = -1;

    let nestInfo = event.nestInfo;
    if (nestInfo && nestInfo.nestIndex < curListData.length && nestInfo.nestIndex >= 0) {
      nestIndex = nestInfo.nestIndex;
      curListData.length > 0 && curListData[0]._isEmpty == true && (nestIndex = nestIndex + 1);
    }

    const prevNodeIndex = this.indexTree.dropItems.indexOf(prevListData[previousIndex]) - this.dropGutterSize;
    const curNodeIndex = this.indexTree.dropItems.indexOf(curListData[currentIndex]) - this.dropGutterSize;
    const nestNodeIndex = this.indexTree.dropItems.indexOf(curListData[nestIndex]) - this.dropGutterSize;

    this.dropped.emit({ prevNodeIndex, curNodeIndex, nestNodeIndex });

    if (nestIndex >= 0) {
      let targetItem = curListData[nestIndex];
      let targetChildren = targetItem?.children ? targetItem.children : [];

      transferArrayItem(
        prevListData,
        targetChildren,
        previousIndex,
        targetChildren.length
      );
      targetItem.children = targetChildren;
    } else {
      transferArrayItem(
        prevListData,
        curListData,
        previousIndex,
        currentIndex
      );
    }
    // }
  }

  nest(event: CdkDragNest<any>) {

  }

  getDropGutterSize(): number {
    let size: number = 0;
    let firstChild: CdkDropDownItem | undefined = this.itemTreeList[0];
    while (firstChild && firstChild._isEmpty == true) {
      size++;

      if (firstChild.children && firstChild.children.length > 0) {
        firstChild = firstChild.children[0];
      } else {
        firstChild = undefined;
      }
    }
    this.dropGutterSize = size;

    this.indexTree = constructCdkIndexTree(buildTree(this.itemTreeList));

    return size;
  }

  ngAfterViewInit() {
    console.log("NgAfterViewinit");

    const ldls: CdkDropList[] = [];
    this.dlq.forEach((dl) => {
      ldls.push(dl)
    });

    asapScheduler.schedule(() => { this.dropLists = ldls; });

  }

  onPageChanged(event: PageEvent) {

    this.pageChanged.emit(event.pageIndex);
  }

  onScroll(event: Event) {
      
    

  }

  hideGap: boolean = true;
  ngAfterContentChecked() {

    if ((this.currentPage + 1) * this.pageSize > this.totalCount) {
      this.hideGap = true;
    }
  }


  constructor() {
  }
}

/**  
Copyright 2019 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license 
*/