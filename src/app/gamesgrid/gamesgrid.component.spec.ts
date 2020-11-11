import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesgridComponent } from './gamesgrid.component';

describe('GamesgridComponent', () => {
  let component: GamesgridComponent;
  let fixture: ComponentFixture<GamesgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
