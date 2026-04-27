import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetSlip } from './bet-slip';

describe('BetSlip', () => {
  let component: BetSlip;
  let fixture: ComponentFixture<BetSlip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetSlip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetSlip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
