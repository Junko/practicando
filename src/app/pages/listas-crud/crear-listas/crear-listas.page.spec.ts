import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearListasPage } from './crear-listas.page';

describe('CrearListasPage', () => {
  let component: CrearListasPage;
  let fixture: ComponentFixture<CrearListasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearListasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
