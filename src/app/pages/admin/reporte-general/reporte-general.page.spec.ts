import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteGeneralPage } from './reporte-general.page';

describe('ReporteGeneralPage', () => {
  let component: ReporteGeneralPage;
  let fixture: ComponentFixture<ReporteGeneralPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGeneralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
