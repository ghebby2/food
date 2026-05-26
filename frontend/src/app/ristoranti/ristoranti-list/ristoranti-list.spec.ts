import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RistorantiList } from './ristoranti-list';

describe('RistorantiList', () => {
  let component: RistorantiList;
  let fixture: ComponentFixture<RistorantiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RistorantiList],
    }).compileComponents();

    fixture = TestBed.createComponent(RistorantiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
