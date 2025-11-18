import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramTheme } from './instagram-theme';

describe('InstagramTheme', () => {
  let component: InstagramTheme;
  let fixture: ComponentFixture<InstagramTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstagramTheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramTheme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
