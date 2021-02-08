import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReferentielComponent } from './new-referentiel.component';

describe('NewReferentielComponent', () => {
  let component: NewReferentielComponent;
  let fixture: ComponentFixture<NewReferentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewReferentielComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
