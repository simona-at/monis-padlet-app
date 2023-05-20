import { TestBed } from '@angular/core/testing';

import { PadletBoardService } from './padlet-board.service';

describe('PadletBoardService', () => {
  let service: PadletBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PadletBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
