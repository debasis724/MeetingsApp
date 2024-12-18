import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamItemComponent } from './team-item.component';

describe('TeamItemComponent', () => {
  let component: TeamItemComponent;
  let fixture: ComponentFixture<TeamItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
