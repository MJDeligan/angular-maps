import {
  Component,
  forwardRef,
  Input, Output, EventEmitter, OnInit
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GeoSearchResult } from 'src/app/models/geo-search-result';

@Component({
  selector: 'app-geosearch-input',
  templateUrl: './geosearch-input.component.html',
  styleUrls: ['./geosearch-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GeosearchInputComponent),
    multi: true
  }]
})
export class GeosearchInputComponent implements ControlValueAccessor, OnInit {

  @Input() label = 'Search';
  @Input() delay = 250;
  @Output() result = new EventEmitter<GeoSearchResult>();

  recentInputs = 0;
  loadingRequests = 0;
  searchText = '';
  searchTextChanged: Subject<string> = new Subject<string>();
  focus = false;
  results: any[] = [];
  value: GeoSearchResult | null = null;
  provider: OpenStreetMapProvider;


  get loading() {
    return this.loadingRequests !== 0;
  }

  constructor() {
    this.provider = new OpenStreetMapProvider();
  }

  ngOnInit(): void {
    this.searchTextChanged
        .pipe(debounceTime(this.delay))
        .subscribe(async (val: string) => {
          this.results = await this.provider.search({query: val});
        });
  }


  /**
   * Invoked when the model has been changed
   */
  onChange: (_: any) => void = (_: any) => {};

  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => {};

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
    this.onChange(this.value);
  }

  onBlurred() {
    setTimeout(() => this.focus = false, 100);
  }

  onResult(result: any) {
    this.value = result;
    this.updateChanges();
    this.result.emit(this.value!);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
    this.updateChanges();
  }

  changed(search: string) {
    this.searchTextChanged.next(search);
  }

  resultTransform = (e: GeoSearchResult) => e.label.length > 40 ? e.label.substring(0, 37) + '...' : e.label;
}
