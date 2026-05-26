import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdineForm } from './ordine-form';

describe('OrdineForm', () => {
  let component: OrdineForm;
  let fixture: ComponentFixture<OrdineForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdineForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdineForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
