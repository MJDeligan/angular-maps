import { Component, HostListener, OnInit, ContentChild, ElementRef, Output, EventEmitter, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() padding!: string;
  @Output() close = new EventEmitter();
  @ViewChild('content') content!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:mousedown', ['$event'])
  private onClick($event: Event) {
    if (!this.content.nativeElement.contains($event.target)) {
      this.close.emit('');
    }
  }

}
