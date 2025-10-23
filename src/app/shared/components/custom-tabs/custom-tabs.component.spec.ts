import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomTabsComponent } from './custom-tabs.component';

describe('CustomTabsComponent', () => {
  let component: CustomTabsComponent;
  let fixture: ComponentFixture<CustomTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
