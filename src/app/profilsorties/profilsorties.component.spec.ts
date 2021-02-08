import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilsortiesComponent } from './profilsorties.component';

describe('ProfilsortiesComponent', () => {
  let component: ProfilsortiesComponent;
  let fixture: ComponentFixture<ProfilsortiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilsortiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilsortiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
