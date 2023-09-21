import { Component, ViewChild, TemplateRef, OnInit, ElementRef, HostListener, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkRichTextEditorComponent, CdkSuggestionSetting } from 'rich-text-editor';
import { DemoButtonComponent } from './demo-button.component';
import { ImageSettingDialog, ImageSettingInfo } from './image-setting-dialog/image-setting-dialog.component';
import { CdkSuggestionItem } from 'rich-text-editor';
import { HashtagComponent } from './hashtag/hashtag.component';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export enum MarkTypes {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
  strike = 'strikeThrough',
  code = 'code-line'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

@Component({
  selector: 'app-dynamic-component',
  standalone: true,
  template: `
    <span style="border: 1px solid grey">
      <b>Unusual: </b>  
      <a href="#" onClick="window.alert('hashtag');">
        <span cdkContent>
          <ng-content></ng-content>
        </span>
      </a>
    </span>
  `
})
export class UnusualInlineComponent { }





@Pipe({name: 'mySafe', standalone: true})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    public transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}


@Component({
  selector: 'app-demo-editor',
  templateUrl: './demo-editor.component.html',
  imports: [SafePipe,CdkRichTextEditorComponent,  DemoButtonComponent,HashtagComponent, UnusualInlineComponent, ImageSettingDialog,FormsModule, CommonModule],
  styleUrls: ['./demo-editor.component.scss'],
  standalone: true,

})
export class DemoEditorComponent {
  @ViewChild('quick_toolbar', { read: TemplateRef, static: true })
  quick_toolbar!: TemplateRef<any>;

  @ViewChild('editor', { read: CdkRichTextEditorComponent, static: true })
  editor!: CdkRichTextEditorComponent;

  @ViewChild('suggestionItemTemplate', { read: TemplateRef, static: true })
  suggestionItemTemplate!: TemplateRef<any>;

  @ViewChild('suggestionInputTemplate', { read: TemplateRef, static: true })
  suggestionInputTemplate!: TemplateRef<any>;

  @ViewChild('hashtagItemTemplate', { read: TemplateRef, static: true })
  hashtagItemTemplate!: TemplateRef<any>;

  @ViewChild('hashtagInputTemplate', { read: TemplateRef, static: true })
  hashtagInputTemplate!: TemplateRef<any>;

  showImageSetting: boolean = false;

  toggleMark = (format: any) => {

    this.editor.toggleMark(format);
    this.updateToolbar();
  };

  isMarkActive = (format: any) => {
    let isActive = this.editor.isMarkActive(format);
    return isActive;
  };

  selectionChanged(event: Selection) {
    this.updateToolbar();
  }

  updateToolbar() {
    this.toolbarItems.forEach(item => {
      item.active = this.isMarkActive(item.format);

      if (item.format == 'insert-image')
        item.active = true;
      if (item.format == 'insert-unusual-inline')
        item.active = this.isComponentActive();
    });

  }

  handleClickAddImage = () => {
    // this.showImageSetting = true;
    const url = window.prompt('Input image url');
    if (url)
      this.editor.insertImage(url, 500, 500);


  }

  insertImage = (url: string, width: number, height: number) => {

    this.editor.insertImage(url, 500, 500);

  }

  handleClickImageSetting = (ev: ImageSettingInfo) => {
    this.showImageSetting = false;
    if (ev.action == 'add') {
      let setting = ev.setting;
      if (setting) {
        this.insertImage(setting.url, setting.width, setting.height);
      }
    }


  }

  isComponentActive = () => {
    return this.editor.isActiveComponent(UnusualInlineComponent);
  }

  toggleComponent = () => {
    this.editor.toggleComponent(UnusualInlineComponent);

    this.updateToolbar();
  }

  filter = (query: string, key: string) => {
    return key.toLowerCase().indexOf(query.toLowerCase()) != -1;
  }

  ngAfterContentChecked() {
    this.suggestions = [
      {
        trigger: "@",
        itemTemplate: this.suggestionItemTemplate,
        inputTemplate: this.suggestionInputTemplate,
        data: [{
          key: "Jane Eyre", value: "Jane Eyre"
        },
        {
          key: "William Shakespeare", value: "William Shakespeare"
        },
        {
          key: "John Smith", value: "John Smith"
        },],
        queryFilter: this.filter
      },
      {
        trigger: "#",
        itemTemplate: this.hashtagItemTemplate,
        inputTemplate: this.hashtagInputTemplate,
        data: [{
          key: "Red", value: "Red"
        },
        {
          key: "Green", value: "Green"

        },
        {
          key: "Blue", value: "Blue"

        },],
        queryFilter: this.filter
      }
    ];
  }

  suggestions: CdkSuggestionSetting[] = [
 
  ];

  suggestionEnabled = true;

  toolbarItems = [
    {
      format: MarkTypes.bold,
      icon: 'format_bold',
      active: false,
      action: this.toggleMark
    },
    {
      format: MarkTypes.italic,
      icon: 'format_italic',
      active: false,
      action: this.toggleMark
    },
    {
      format: MarkTypes.underline,
      icon: 'format_underlined',
      active: false,
      action: this.toggleMark
    },
    {
      format: MarkTypes.code,
      icon: 'code',
      active: false,
      action: this.toggleMark
    },
    {
      format: 'heading-one',
      icon: 'looks_one',
      active: false,
      action: this.toggleMark
    },
    {
      format: 'heading-two',
      icon: 'looks_two',
      active: false,
      action: this.toggleMark
    },
    {
      format: 'blockquote',
      icon: 'format_quote',
      active: false,
      action: this.toggleMark
    },
    {
      format: 'numbered-list',
      icon: 'format_list_numbered',
      active: false,
      action: this.toggleMark
    },
    {
      format: 'bulleted-list',
      icon: 'format_list_bulleted',
      active: false,
      action: this.toggleMark
    },
    {
      format: 'insert-image',
      icon: 'add_photo_alternate',
      active: true,
      action: this.handleClickAddImage
    },
    {
      format: 'insert-unusual-inline',
      icon: 'link',
      active: false,
      action: this.toggleComponent,
    }
  ];

  embed_url = "https://richtexteditor.com/Demos/drag-and-drop-images.aspx";




}
