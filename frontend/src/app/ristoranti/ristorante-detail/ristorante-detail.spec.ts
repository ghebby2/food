import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RistoranteDetail } from './ristorante-detail';

describe('RistoranteDetail', () => {
  let component: RistoranteDetail;
  let fixture: ComponentFixture<RistoranteDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RistoranteDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(RistoranteDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
