import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectionPageComponent } from './location-selection-page.component';

describe('LocationSelectionPageComponent', () => {
  let component: LocationSelectionPageComponent;
  let fixture: ComponentFixture<LocationSelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationSelectionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
