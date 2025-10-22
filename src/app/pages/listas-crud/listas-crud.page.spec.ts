import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListasCrudPage } from './listas-crud.page';

describe('ListasCrudPage', () => {
  let component: ListasCrudPage;
  let fixture: ComponentFixture<ListasCrudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
