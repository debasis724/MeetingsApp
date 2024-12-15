import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-item',
  imports: [],
  templateUrl: './team-item.component.html',
  styleUrl: './team-item.component.scss'
})
export class TeamItemComponent {
  @Input() team: any;
}
