import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertControlsComponent } from './alert-controls.component';

describe('AlertControlsComponent', () => {
  let component: AlertControlsComponent;
  let fixture: ComponentFixture<AlertControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
