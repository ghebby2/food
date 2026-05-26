import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecensioniList } from './recensioni-list';

describe('RecensioniList', () => {
  let component: RecensioniList;
  let fixture: ComponentFixture<RecensioniList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecensioniList],
    }).compileComponents();

    fixture = TestBed.createComponent(RecensioniList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
