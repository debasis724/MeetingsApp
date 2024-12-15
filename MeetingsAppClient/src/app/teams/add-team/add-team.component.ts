import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-team',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss'
})
export class AddTeamComponent {
  @Output() teamAdded = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  team = {
    name: '',
    shortName: '',
    description: '',
    members: [] as string[],  // Store the members' emails
  };

  newMemberEmail: string = '';  // Temporary variable to hold the email input

  // Add new member to the team members array
  addMember() {
    if (this.newMemberEmail && !this.team.members.includes(this.newMemberEmail)) {
      this.team.members.push(this.newMemberEmail);  // Add email to members array
      this.newMemberEmail = '';  // Clear input after adding
    }
  }

  // Remove a member from the team members array
  removeMember(index: number) {
    this.team.members.splice(index, 1);  // Remove member at the given index
  }

  // Emit the team data to the parent component when the team is added
  addTeam() {
    this.teamAdded.emit(this.team);  // Emit team object with members
  }
}
