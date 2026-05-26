import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientiList } from './ingredienti-list';

describe('IngredientiList', () => {
  let component: IngredientiList;
  let fixture: ComponentFixture<IngredientiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientiList],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
