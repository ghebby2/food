import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdineDetail } from './ordine-detail';

describe('OrdineDetail', () => {
  let component: OrdineDetail;
  let fixture: ComponentFixture<OrdineDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdineDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdineDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
