import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChekoutComponent } from './chekout.component';

describe('ChekoutComponent', () => {
  let component: ChekoutComponent;
  let fixture: ComponentFixture<ChekoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChekoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChekoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
