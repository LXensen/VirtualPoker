import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersmallComponent } from './playersmall.component';

describe('PlayersmallComponent', () => {
  let component: PlayersmallComponent;
  let fixture: ComponentFixture<PlayersmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
