import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComptenceComponent } from './new-comptence.component';

describe('NewComptenceComponent', () => {
  let component: NewComptenceComponent;
  let fixture: ComponentFixture<NewComptenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewComptenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewComptenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
