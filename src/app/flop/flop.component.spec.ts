import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlopComponent } from './flop.component';

describe('FlopComponent', () => {
  let component: FlopComponent;
  let fixture: ComponentFixture<FlopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
