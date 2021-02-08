import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGcComponent } from './single-gc.component';

describe('SingleGcComponent', () => {
  let component: SingleGcComponent;
  let fixture: ComponentFixture<SingleGcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleGcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleGcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
