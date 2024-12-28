import { TestBed } from '@angular/core/testing';

import { NasaServiceService } from './nasa-service.service';

describe('NasaServiceService', () => {
  let service: NasaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NasaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
