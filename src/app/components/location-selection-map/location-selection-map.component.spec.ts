import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectionMapComponent } from './location-selection-map.component';

describe('LocationSelectionMapComponent', () => {
  let component: LocationSelectionMapComponent;
  let fixture: ComponentFixture<LocationSelectionMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationSelectionMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
