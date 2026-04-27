import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fancy } from './fancy';

describe('Fancy', () => {
  let component: Fancy;
  let fixture: ComponentFixture<Fancy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fancy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fancy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
