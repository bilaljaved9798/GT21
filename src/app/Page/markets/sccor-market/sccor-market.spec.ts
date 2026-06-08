import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SccorMarket } from './sccor-market';

describe('SccorMarket', () => {
  let component: SccorMarket;
  let fixture: ComponentFixture<SccorMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SccorMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SccorMarket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
