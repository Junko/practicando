import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosCrudPage } from './usuarios-crud.page';

describe('UsuariosCrudPage', () => {
  let component: UsuariosCrudPage;
  let fixture: ComponentFixture<UsuariosCrudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
