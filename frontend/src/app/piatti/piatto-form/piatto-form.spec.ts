import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiattoForm } from './piatto-form';

describe('PiattoForm', () => {
  let component: PiattoForm;
  let fixture: ComponentFixture<PiattoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiattoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PiattoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
