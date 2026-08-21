import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicStatus } from './public-status';

describe('PublicStatus', () => {
  let component: PublicStatus;
  let fixture: ComponentFixture<PublicStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
