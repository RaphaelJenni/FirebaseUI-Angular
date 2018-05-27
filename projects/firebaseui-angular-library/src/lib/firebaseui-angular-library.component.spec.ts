import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseuiAngularLibraryComponent } from './firebaseui-angular-library.component';

describe('FirebaseuiAngularLibraryComponent', () => {
  let component: FirebaseuiAngularLibraryComponent;
  let fixture: ComponentFixture<FirebaseuiAngularLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirebaseuiAngularLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseuiAngularLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
