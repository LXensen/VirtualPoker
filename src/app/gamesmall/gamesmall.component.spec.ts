import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesmallComponent } from './gamesmall.component';

describe('GamesmallComponent', () => {
  let component: GamesmallComponent;
  let fixture: ComponentFixture<GamesmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
