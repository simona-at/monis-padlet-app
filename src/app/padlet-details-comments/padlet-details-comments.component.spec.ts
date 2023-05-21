import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadletDetailsCommentsComponent } from './padlet-details-comments.component';

describe('PadletDetailsCommentsComponent', () => {
  let component: PadletDetailsCommentsComponent;
  let fixture: ComponentFixture<PadletDetailsCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PadletDetailsCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadletDetailsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
