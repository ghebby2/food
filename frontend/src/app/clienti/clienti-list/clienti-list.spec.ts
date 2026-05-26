import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientiList } from './clienti-list';

describe('ClientiList', () => {
  let component: ClientiList;
  let fixture: ComponentFixture<ClientiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientiList],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
