import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesmallComponent } from './tablesmall.component';

describe('TablesmallComponent', () => {
  let component: TablesmallComponent;
  let fixture: ComponentFixture<TablesmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablesmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
