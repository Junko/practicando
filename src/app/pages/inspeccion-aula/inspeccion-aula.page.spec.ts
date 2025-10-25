import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspeccionAulaPage } from './inspeccion-aula.page';

describe('InspeccionAulaPage', () => {
  let component: InspeccionAulaPage;
  let fixture: ComponentFixture<InspeccionAulaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionAulaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
