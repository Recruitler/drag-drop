import { CommonModule } from '@angular/common';
import {
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    Output,
    Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface ImageSettingInfo {
    event: MouseEvent,
    action: string,
    setting?: {
        url: string,
        width: number,
        height: number,
    }
}

@Component({
    selector: 'image-setting-dialog',
    templateUrl: './image-setting-dialog.component.html',
    styleUrls: ['./image-setting-dialog.component.scss'],
    imports: [FormsModule],
    standalone: true
})
export class ImageSettingDialog {

    @Output('btnClicked') onButtonClick: EventEmitter<ImageSettingInfo> = new EventEmitter();
    constructor(private elementRef: ElementRef, private renderer2: Renderer2) { }

    url: string = "";
    width: number = 500;
    height: number = 500;
    handleClick(ev: MouseEvent, action: string) {
        
        ev.preventDefault();
        const settingInfo: ImageSettingInfo = { event: ev, action };
        if (action == 'add') {
            settingInfo.setting = {
                url: this.url,
                width: this.width,
                height: this.height
            }
        }

        this.onButtonClick.emit(settingInfo);
    }

}
