import { TestBed, inject } from '@angular/core/testing';

import { FirebaseuiAngularLibraryService } from './firebaseui-angular-library.service';

describe('FirebaseuiAngularLibraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseuiAngularLibraryService]
    });
  });

  it('should be created', inject([FirebaseuiAngularLibraryService], (service: FirebaseuiAngularLibraryService) => {
    expect(service).toBeTruthy();
  }));
});
