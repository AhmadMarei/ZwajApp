import { TestBed, async, inject } from '@angular/core/testing';

import { PreventUnsaveChangesGuard } from './prevent-unsave-changes.guard';

describe('PreventUnsaveChangesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreventUnsaveChangesGuard]
    });
  });

  it('should ...', inject([PreventUnsaveChangesGuard], (guard: PreventUnsaveChangesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
