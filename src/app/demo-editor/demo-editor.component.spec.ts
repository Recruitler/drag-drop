import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoEditorComponent } from './demo-editor.component';

describe('DemoEditorComponent', () => {
  let component: DemoEditorComponent;
  let fixture: ComponentFixture<DemoEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoEditorComponent]
    });
    fixture = TestBed.createComponent(DemoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
