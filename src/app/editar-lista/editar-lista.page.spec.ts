import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarListaPage } from './editar-lista.page';

describe('EditarListaPage', () => {
  let component: EditarListaPage;
  let fixture: ComponentFixture<EditarListaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
