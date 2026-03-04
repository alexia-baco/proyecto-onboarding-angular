import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToLandingButton } from './back-to-landing-button';

describe('BackToLandingButton', () => {
  let component: BackToLandingButton;
  let fixture: ComponentFixture<BackToLandingButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackToLandingButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackToLandingButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
