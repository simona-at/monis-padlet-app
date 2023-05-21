import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadletUsersFormComponent } from './padlet-users-form.component';

describe('PadletUsersFormComponent', () => {
  let component: PadletUsersFormComponent;
  let fixture: ComponentFixture<PadletUsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PadletUsersFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadletUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
