import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FirebaseuiAngularLibraryComponent} from './firebaseui-angular-library.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subject} from 'rxjs';
import {User} from 'firebase';
import {FirebaseuiAngularLibraryService} from './firebaseui-angular-library.service';

describe('FirebaseuiAngularLibraryComponent', () => {
  let component: FirebaseuiAngularLibraryComponent;
  let fixture: ComponentFixture<FirebaseuiAngularLibraryComponent>;
  let firebaseAuthState: Subject<User>;

  beforeEach(async(() => {
    firebaseAuthState = new Subject();

    TestBed.configureTestingModule({
    imports: [FirebaseuiAngularLibraryComponent],
    providers: [
        {
            provide: AngularFireAuth,
            useValue: new class {
                authState = firebaseAuthState.asObservable();
            }()
        },
        {
            provide: FirebaseuiAngularLibraryService,
            useValue: new class {
                firebaseUiInstance = {};
            }
        },
        { provide: 'firebaseUIAuthConfig', useValue: { main: 'MAIN', overwritten: 'MAIN' } },
        { provide: 'firebaseUIAuthConfigFeature', useValue: { feature: 'FEATURE', overwritten: 'FEATURE' } }
    ]
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

  describe('firebaseUiConfig', () => {
    it('should combine firebaseUiConfig with firebaseUiConfig_Feature', () => {
      expect(component.firebaseUiConfig).toEqual({main: 'MAIN', feature: 'FEATURE', overwritten: 'FEATURE'} as any);
    });
  });
});
