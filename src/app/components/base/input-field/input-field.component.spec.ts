import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ InputFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error when one is passed', () => {
    const error = 'An error message';
    component.error = error;
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toContain(error);
  });

  it('should emit an inFocus event when the input is focused', () => {
    const input = fixture.debugElement.query(By.css('input'));
    spyOn(component.inFocus, 'emit');

    input.nativeElement.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(component.inFocus.emit).toHaveBeenCalled();
  });

  it('should have the correct label', () => {
    const label = 'Test label text';
    component.label = label;
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('label').textContent).toContain(label);
  });

  it('should correctly set the input type', () => {
    type TypeChoice = 'text' | 'password' | 'search' | 'email' | 'url' | 'tel';
    const types: TypeChoice[] = ['text', 'password', 'search', 'email', 'url', 'tel'];
    types.forEach((t) => {
      component.type = t;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.type).toBe(t);
    });
  });
});
