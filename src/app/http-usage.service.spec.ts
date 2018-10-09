import { TestBed } from '@angular/core/testing';

import { HttpUsageService } from './http-usage.service';

describe('HttpUsageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpUsageService = TestBed.get(HttpUsageService);
    expect(service).toBeTruthy();
  });
});
