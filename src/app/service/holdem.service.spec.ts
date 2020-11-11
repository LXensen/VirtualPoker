import { TestBed } from '@angular/core/testing';

import { HoldemService } from './holdem.service';

describe('HoldemService', () => {
  let service: HoldemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
