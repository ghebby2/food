import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RistoranteForm } from './ristorante-form';

describe('RistoranteForm', () => {
  let component: RistoranteForm;
  let fixture: ComponentFixture<RistoranteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RistoranteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RistoranteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
