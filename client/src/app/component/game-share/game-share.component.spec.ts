import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameShareComponent } from './game-share.component';

describe('GameShareComponent', () => {
  let component: GameShareComponent;
  let fixture: ComponentFixture<GameShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
