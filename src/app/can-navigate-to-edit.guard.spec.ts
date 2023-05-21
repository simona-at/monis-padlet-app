import { TestBed } from '@angular/core/testing';

import { CanNavigateToEditGuard } from './can-navigate-to-edit.guard';

describe('CanNavigateToEditGuard', () => {
  let guard: CanNavigateToEditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanNavigateToEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
