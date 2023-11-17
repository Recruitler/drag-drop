import { NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { asapScheduler } from 'rxjs';
import { CdkDragDrop, CdkDragNest, CdkNestDrop } from '../../drag-events';

import { NgClass } from '@angular/common';
import { CdkDrag } from '../../directives/drag';
import { CdkDragHandle } from '../../directives/drag-handle';
import { CdkDragPlaceholder } from '../../directives/drag-placeholder';
import { CdkDragPreview } from '../../directives/drag-preview';
import { CdkDropList } from '../../directives/drop-list';
import { CdkDropListGroup } from '../../directives/drop-list-group';
import { DragDrop } from '../../drag-drop';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  transferArrayItem
} from '../../drag-utils';

export type IPageMode = 'VIRTUAL-SCROLL' | 'PAGINATION';

import { CdkDropDownItem, getParent, } from '../../drag-drop-tree';


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
    NgStyle,
  ],
  encapsulation: ViewEncapsulation.None
})
export class CdkNestedDragDropComponent {


  @Input('cdkNestedDropDownData')
  itemTreeList: CdkDropDownItem[] = [];

  @Input('cdkListItemTemplate')
  itemTemplate!: TemplateRef<any>;

  @Input('cdkPlaceholderTemplate')
  placeholderTemplate!: TemplateRef<any>;

  @Input('cdkPageMode') pageMode: IPageMode = 'PAGINATION';

  @Input('height') style_height: string = '100%';


  @Output('cdkDragDropped') readonly dropped: EventEmitter<CdkNestDrop> = new EventEmitter<
    CdkNestDrop
  >();


  @Output('cdkScrollNextPage') readonly scrollNextPage: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild('scrollBox') scrollBox!: ElementRef<HTMLElement>;
  @ViewChild('scrollGap') scrollGap!: ElementRef<HTMLElement>;
  @ViewChild('scrollContent') scrollContent!: ElementRef<HTMLElement>;

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  dropLists: CdkDropList[] = [];
  dropGutterSize = 0;

  drop(event: CdkDragDrop<any>) {

    let prevListData: CdkDropDownItem[] = event.previousContainer.data;
    let curListData: CdkDropDownItem[] = event.container.data;

    const previousIndex = prevListData.length > 0 && prevListData[0]['_isEmpty'] == true ? event.previousIndex + 1 : event.previousIndex;
    const currentIndex = curListData.length > 0 && curListData[0]['_isEmpty'] == true ? event.currentIndex + 1 : event.currentIndex;
    let nestIndex = -1;

    let nestInfo = event.nestInfo;
    if (nestInfo && nestInfo.nestIndex < curListData.length && nestInfo.nestIndex >= 0) {
      nestIndex = nestInfo.nestIndex;
      curListData.length > 0 && curListData[0]['_isEmpty'] == true && (nestIndex = nestIndex + 1);
    }

    if (nestIndex >= 0) {
      let targetItem = curListData[nestIndex];
      let targetChildren = targetItem?.children ? targetItem.children : [];

      // BEGIN OF SENDING MESSAGE
      this.dropped.emit({
        item: prevListData[previousIndex],
        parent: targetItem,
        position: targetChildren.length,
        isNesting: true
      });
      // END OF SENDING MESSAGE

      transferArrayItem(
        prevListData,
        targetChildren,
        previousIndex,
        targetChildren.length
      );
      targetItem.children = targetChildren;
    } else {
      // BEGIN OF SENDING MESSAGE
      const parent = getParent(this.itemTreeList, curListData)
        ;
      this.dropped.emit({
        item: prevListData[previousIndex],
        parent: parent,
        position: currentIndex,
        isNesting: false
      });
      // END OF SENDING MESSAGE

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


    this.dropGutterSize = 0;

    return 0;
  }

  ngAfterViewInit() {
    console.log("NgAfterViewinit");

    const ldls: CdkDropList[] = [];
    this.dlq.forEach((dl) => {
      ldls.push(dl)
    });

    asapScheduler.schedule(() => { this.dropLists = ldls; });

  }

  isLoading = false;

  onScroll(event: Event) {
    if (this.pageMode == 'VIRTUAL-SCROLL') {
      console.log(this.scrollBox.nativeElement.scrollHeight, this.scrollBox.nativeElement.scrollTop, this.scrollBox.nativeElement.clientHeight)
      if (!this.isLoading && this.showGap && this.scrollBox.nativeElement.scrollHeight - this.scrollBox.nativeElement.scrollTop <= this.scrollBox.nativeElement.clientHeight + 1) {
        this.isLoading = true;
        this.scrollNextPage.emit(event);

      }
    }
  }

  showGap: boolean = true;
  ngAfterContentChecked() {
    if (this.pageMode == 'VIRTUAL-SCROLL') {
      this.showGap = true;
    } else if (this.pageMode == 'PAGINATION') {
      this.showGap = false;
    }

  }

  ngOnChanges(change: SimpleChanges) {
    this.isLoading = false;
  }
  

  constructor() {
  }
}

/**
Copyright 2019 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/