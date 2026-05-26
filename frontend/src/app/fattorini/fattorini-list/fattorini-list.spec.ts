import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FattoriniList } from './fattorini-list';

describe('FattoriniList', () => {
  let component: FattoriniList;
  let fixture: ComponentFixture<FattoriniList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FattoriniList],
    }).compileComponents();

    fixture = TestBed.createComponent(FattoriniList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
