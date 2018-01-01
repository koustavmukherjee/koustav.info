import { TestBed, inject } from '@angular/core/testing';

import { FruitRageBasicService } from './fruit-rage-basic.service';

describe('FruitRageBasicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FruitRageBasicService]
    });
  });

  it('should be created', inject([FruitRageBasicService], (service: FruitRageBasicService) => {
    expect(service).toBeTruthy();
  }));
});
