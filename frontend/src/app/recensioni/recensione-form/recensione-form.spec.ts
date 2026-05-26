import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecensioneForm } from './recensione-form';

describe('RecensioneForm', () => {
  let component: RecensioneForm;
  let fixture: ComponentFixture<RecensioneForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecensioneForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RecensioneForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
