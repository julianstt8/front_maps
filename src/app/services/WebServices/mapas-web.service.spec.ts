import { TestBed } from '@angular/core/testing';

import { MapasWebService } from './mapas-web.service';

describe('MapasWebService', () => {
  let service: MapasWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapasWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
