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

@Component({
    selector: 'app-hashtag',
    templateUrl: './hashtag.component.html',
    styleUrls: ['./hashtag.component.scss'],
    imports: [],
    standalone: true
})
export class HashtagComponent {

    
    constructor(private elementRef: ElementRef<HTMLElement>) { }
    handleClick(ev: MouseEvent) {
        this.elementRef.nativeElement.remove();
    
    }

    

}
