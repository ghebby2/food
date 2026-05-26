import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdiniList } from './ordini-list';

describe('OrdiniList', () => {
  let component: OrdiniList;
  let fixture: ComponentFixture<OrdiniList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdiniList],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdiniList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
