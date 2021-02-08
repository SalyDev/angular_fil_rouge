import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetInfosComponent } from './reset-infos.component';

describe('ResetInfosComponent', () => {
  let component: ResetInfosComponent;
  let fixture: ComponentFixture<ResetInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetInfosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
