import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsTooltipComponent } from './results-tooltip.component';

describe('ResultsTooltipComponent', () => {
  let component: ResultsTooltipComponent;
  let fixture: ComponentFixture<ResultsTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
