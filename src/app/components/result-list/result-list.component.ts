import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent<T> implements OnInit {

  @Input() resultList: Array<T> = [];
  @Input() dirty = false;
  @Input() focus = false;
  @Input() repr: ((entity: T) => string) = (entity: T) => `${entity}`;
  @Output() resultSelected = new EventEmitter<T>();


  constructor() { }

  ngOnInit(): void {
  }

  onResult(result: T) {
    this.resultSelected.emit(result);
  }
}
