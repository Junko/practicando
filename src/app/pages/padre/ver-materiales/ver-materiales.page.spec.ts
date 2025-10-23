import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerMaterialesPage } from './ver-materiales.page';

describe('VerMaterialesPage', () => {
  let component: VerMaterialesPage;
  let fixture: ComponentFixture<VerMaterialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMaterialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
