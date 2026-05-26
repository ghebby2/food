import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FattorinoForm } from './fattorino-form';

describe('FattorinoForm', () => {
  let component: FattorinoForm;
  let fixture: ComponentFixture<FattorinoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FattorinoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FattorinoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
