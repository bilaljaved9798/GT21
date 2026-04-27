import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalMarket } from './goal-market';

describe('GoalMarket', () => {
  let component: GoalMarket;
  let fixture: ComponentFixture<GoalMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalMarket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
