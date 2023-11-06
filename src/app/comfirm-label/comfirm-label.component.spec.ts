import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmLabelComponent } from './comfirm-label.component';

describe('ComfirmLabelComponent', () => {
  let component: ComfirmLabelComponent;
  let fixture: ComponentFixture<ComfirmLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComfirmLabelComponent]
    });
    fixture = TestBed.createComponent(ComfirmLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
