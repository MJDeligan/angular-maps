import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../base/input-field/input-field.component';
import { ResultListComponent } from '../result-list/result-list.component';

import { GeosearchInputComponent } from './geosearch-input.component';

describe('GeosearchInputComponent', () => {
  let component: GeosearchInputComponent;
  let fixture: ComponentFixture<GeosearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ GeosearchInputComponent, ResultListComponent, InputFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeosearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
