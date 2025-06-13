import { TestBed } from '@angular/core/testing';

import { ValidationRoutienService } from './validation-routien.service';

describe('ValidationRoutienService', () => {
  let service: ValidationRoutienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationRoutienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
