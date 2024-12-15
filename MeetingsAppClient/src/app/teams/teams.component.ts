import { Component, OnInit } from '@angular/core';
import { AddTeamComponent } from "./add-team/add-team.component";
import { TeamItemComponent } from './team-item/team-item.component';
import { CommonModule } from '@angular/common';
import { MeetingsService } from '../meetings.service';

@Component({
  selector: 'app-teams',
  imports: [AddTeamComponent, TeamItemComponent, CommonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  teams:any[] = [];
  addTeamMode = false;
  constructor(private meetingService: MeetingsService) {}

  ngOnInit() {
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.meetingService.getTeams().subscribe(
      (teams) => {
        this.teams = teams;
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }
  toggleAddTeam() {
    this.addTeamMode = !this.addTeamMode;
  }

  addTeam(team: any): void {
    this.meetingService.addTeam(team).subscribe(
      (newTeam) => {
        this.teams.push(newTeam);  // Add the new team to the list
        this.addTeamMode = false;  // Close the add team mode
      },
      (error) => {
        console.error('Error adding team:', error);
      }
    );
  }
}
