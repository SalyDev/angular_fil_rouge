import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGcComponent } from './new-gc.component';

describe('NewGcComponent', () => {
  let component: NewGcComponent;
  let fixture: ComponentFixture<NewGcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
