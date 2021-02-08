import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleReferentielComponent } from './single-referentiel.component';

describe('SingleReferentielComponent', () => {
  let component: SingleReferentielComponent;
  let fixture: ComponentFixture<SingleReferentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleReferentielComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
