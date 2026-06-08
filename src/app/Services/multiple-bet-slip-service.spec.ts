import { TestBed } from '@angular/core/testing';

import { MultipleBetSlipService } from './multiple-bet-slip-service';

describe('MultipleBetSlipService', () => {
  let service: MultipleBetSlipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleBetSlipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
