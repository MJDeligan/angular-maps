import {Component, forwardRef, Input, Output, EventEmitter} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Functions as native input!
 *
 * @property {string} label - sets the label of the input
 * @property {string} id -  sets id of input (ref. for label)
 * @property {{[klass: string]: any}} style - Optional styles to apply to the input field.
 * @property {string} error - An errror message to display beneath the input field.
 * @property {'text' | 'password' | 'search' | 'email' | 'url' | 'tel'} type - The type of input. (limited to pure text-inputs)
 */
@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() label = 'Label';
  @Input() id = 'defaultId';
  @Input() style: {[klass: string]: any} = {};
  @Input() error = '';
  @Input() type: 'text' | 'password' | 'search' | 'email' | 'url' | 'tel' = 'text';
  @Input() autocomplete = true;
  @Input() small = false;
  @Output() inFocus = new EventEmitter();
  @Output() blurred = new EventEmitter();
  value = '';
  disabled!: boolean;
  focused = false;

  get elevatedLabel() {
    return this.focused || this.value;
  }

  onChange!: (value: string) => void;
  onTouched!: () => void;

  constructor() { }

  onFocus() {
    this.inFocus.emit();
    this.toggle();
  }

  toggle() {
    this.focused = !this.focused;
  }

  updateChanges() {
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value ? value : '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}