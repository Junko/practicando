import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearUsuarioHijoPage } from './crear-usuario-hijo.page';

describe('CrearUsuarioHijoPage', () => {
  let component: CrearUsuarioHijoPage;
  let fixture: ComponentFixture<CrearUsuarioHijoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUsuarioHijoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
