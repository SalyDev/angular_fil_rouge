import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCompetenceComponent } from './single-competence.component';

describe('SingleCompetenceComponent', () => {
  let component: SingleCompetenceComponent;
  let fixture: ComponentFixture<SingleCompetenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCompetenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCompetenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
