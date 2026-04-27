import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toss } from './toss';

describe('Toss', () => {
  let component: Toss;
  let fixture: ComponentFixture<Toss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toss]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Toss);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
