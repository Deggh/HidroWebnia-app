import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HidroponiaPage } from './hidroponia.page';

describe('HidroponiaPage', () => {
  let component: HidroponiaPage;
  let fixture: ComponentFixture<HidroponiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HidroponiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
