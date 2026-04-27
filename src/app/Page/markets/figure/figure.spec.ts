import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Figure } from './figure';

describe('Figure', () => {
  let component: Figure;
  let fixture: ComponentFixture<Figure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Figure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Figure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
