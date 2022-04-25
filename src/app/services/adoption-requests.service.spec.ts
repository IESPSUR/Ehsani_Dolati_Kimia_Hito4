import { TestBed } from '@angular/core/testing';

import { AdoptionRequestsService } from './adoption-requests.service';

describe('AdoptionRequestsService', () => {
  let service: AdoptionRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdoptionRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
