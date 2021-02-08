import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePromoComponent } from './single-promo.component';

describe('SinglePromoComponent', () => {
  let component: SinglePromoComponent;
  let fixture: ComponentFixture<SinglePromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
