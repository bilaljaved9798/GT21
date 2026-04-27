import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiedMarket } from './tied-market';

describe('TiedMarket', () => {
  let component: TiedMarket;
  let fixture: ComponentFixture<TiedMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiedMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiedMarket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
