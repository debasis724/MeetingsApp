import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Imeeting from './../models/Imeeting';
import { MeetingsService } from '../meetings.service';

@Component({
  selector: 'app-calendar',
  imports: [FormsModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  selectedDate: string = new Date().toISOString().split('T')[0]; // Initialize with current date
  timeSlots: string[] = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ':00' // Generate time slots 00:00 to 23:00
  );
  meetings: Imeeting[] = [];
  filteredMeetings: Imeeting[] = [];

  constructor(private meetingsService: MeetingsService) {}

  ngOnInit(): void {
    this.fetchMeetings(); // Initially fetch meetings
  }

  fetchMeetings(): void {
    this.meetingsService.getMeetings().subscribe(
      (meetings) => {
        this.meetings = meetings;
        console.log(meetings); // Log the fetched meetings to the console
        this.filterMeetingsByDate(); // Filter meetings by the selected date
      },
      (error) => {
        console.error('Error fetching meetings', error);
      }
    );
  }

  filterMeetingsByDate(): void {
    // Filter meetings by the selected date
    this.filteredMeetings = this.meetings.filter(meeting =>
      meeting.date.startsWith(this.selectedDate) // Check if meeting date starts with selectedDate
    );
  
    // Optionally, log the filtered meetings for debugging
    console.log('Filtered meetings for the selected date:', this.filteredMeetings);
  }

  getMeetingsForSlot(time: string): Imeeting[] {
    return this.filteredMeetings.filter(meeting => {
      const meetingStartTime = meeting.startTime;
      const meetingEndTime = meeting.endTime;

      // Convert time strings to numeric hours for easier comparison (optional but makes logic cleaner)
      const meetingStartHour = parseInt(meetingStartTime.split(':')[0], 10);
      const meetingEndHour = parseInt(meetingEndTime.split(':')[0], 10);
      const timeSlotHour = parseInt(time.split(':')[0], 10);

      // Only show meetings in the first slot (start time), prevent duplicate display in multiple time slots
      return (
        meetingStartHour <= timeSlotHour && meetingEndHour > timeSlotHour // Meeting spans over this time slot
        && meetingStartTime === time // Ensure the meeting is shown only in the first time slot it starts
      );
    });
  }

  onDateChange(): void {
    this.filterMeetingsByDate(); // Re-filter meetings when the date is changed
  }
}