import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultListComponent } from './result-list.component';

interface DummyClass {
  label: string;
}

describe('ResultListComponent', () => {
  let component: ResultListComponent<DummyClass>;
  let fixture: ComponentFixture<ResultListComponent<DummyClass>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<ResultListComponent<DummyClass>>(ResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
