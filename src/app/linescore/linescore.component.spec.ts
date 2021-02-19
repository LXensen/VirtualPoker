import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinescoreComponent } from './linescore.component';

describe('LinescoreComponent', () => {
  let component: LinescoreComponent;
  let fixture: ComponentFixture<LinescoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinescoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinescoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
