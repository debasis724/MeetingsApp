import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import Imeeting from './../models/Imeeting';
import { Router } from '@angular/router';
import { MeetingsService } from '../meetings.service';

@Component({
  selector: 'app-meetings',
  imports: [FormsModule, CommonModule ,AddMeetingComponent],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent {
  currentTab: string = 'filter'; // Default tab
  exampleEmails: string[] = [
    'example1@gmail.com',
    'example2@gmail.com',
    'example3@gmail.com',
    'example4@gmail.com',
    'example5@gmail.com'
  ];
  selectedEmail: string = '';
  meetings: Imeeting[] = [];

  // Inputs for the filter
  selectedDate: string = 'today';
  searchQuery: string = '';

  // Filtered meetings
  filteredMeetings: Imeeting[] = [];

  ngOnInit() {
    this.loadMeetings();
  }
  constructor(private router: Router, private meetingsService: MeetingsService){}

  loadMeetings() {
    this.meetingsService.getMeetings().subscribe(
      (data: Imeeting[]) => {
        this.meetings = data; // Assign the fetched data to meetings array
        this.filterMeetings(); // Filter meetings after loading them
      },
      (error) => {
        console.error('Error fetching meetings:', error);
      }
    );
  }

  // Function to filter meetings
  filterMeetings() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the date

    // Split the search query into individual terms and remove any extra spaces
    const searchTerms = this.searchQuery.trim().toLowerCase().split(/\s+/);

    this.filteredMeetings = this.meetings.filter((meeting: Imeeting) => {
      const meetingDate = new Date(meeting.date);  // Convert the meeting's date to a Date object
      meetingDate.setHours(0, 0, 0, 0);  // Normalize the meeting's date to 00:00:00 for comparison
  
      const isMatchingDate = meetingDate.getTime() === today.getTime();  // Only include meetings from today
  
      // Check if the meeting matches the selected date filter
      let matchesDate = false;
      if (this.selectedDate === 'today') {
        matchesDate = isMatchingDate;  // Only show meetings for the selected day (today)
      } else {
        // If the user selects other filters, keep it open to all meetings without any date filters
        matchesDate = true;
      }

      // Check if at least one search term is in the meeting's name or description
      const matchesSearch = searchTerms.some(term => 
        meeting.name.toLowerCase().includes(term) || 
        meeting.description.toLowerCase().includes(term)
      );

      // Return true if both date and search conditions are met
      return matchesDate && (this.searchQuery.trim() === '' || matchesSearch);
    });

    // Sort the filtered meetings in chronological order
    this.filteredMeetings.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime.hours}:${a.startTime.minutes}`);
      const dateB = new Date(`${b.date}T${b.startTime.hours}:${b.startTime.minutes}`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // Utility function to get attendee emails
  getAttendeeEmails(attendees: Imeeting['attendees']): string {
    return attendees.map((attendee) => attendee.email).join(', ');
  }

  onMeetingAdded(newMeeting:Imeeting) {
    this.meetingsService.addMeeting(newMeeting).subscribe(
      (addedMeeting: Imeeting) => {
        this.loadMeetings();
        // this.meetings.push(addedMeeting); // Add the newly created meeting to the meetings array
        this.filterMeetings(); // Re-filter the meetings list after adding
        this.filteredMeetings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime.hours}:${a.startTime.minutes}`);
          const dateB = new Date(`${b.date}T${b.startTime.hours}:${b.startTime.minutes}`);
          return dateA.getTime() - dateB.getTime();
        });

        this.currentTab = 'filter'; // Optional: Switch to the filter tab or wherever meetings are displayed
      },
      (error) => {
        console.error('Error adding meeting:', error); // Handle error if the addition fails
      }
    );
  }

  // Function to handle "Excuse yourself" button click
  // onMeetingAdded(meeting: Imeeting) {
  //   this.meetings.push(meeting);  // Push the new meeting into the meetings array
  //   this.filterMeetings();  // Re-filter meetings after adding the new one
  //   this.filteredMeetings.sort((a, b) => {
  //     const dateA = new Date(`${a.date}T${a.startTime.hours}:${a.startTime.minutes}`);
  //     const dateB = new Date(`${b.date}T${b.startTime.hours}:${b.startTime.minutes}`);
  //     return dateA.getTime() - dateB.getTime();
  //   });

  //   // Now, switch to the "filter" tab or wherever the meetings are displayed
  //   this.currentTab = 'filter';

  //   // Optionally, if you have specific routing, navigate via router
  //   // this.router.navigate(['']);
  // }
  excuseYourself(meeting: Imeeting) {
    console.log(`Excused from meeting: ${meeting.name}`);
    
    // Remove the last attendee from the attendees list
    if (meeting.attendees.length > 0) {
      meeting.attendees.pop();  // Remove the last attendee
    }
    
    // Update filtered meetings (optional based on your app state)
    this.filterMeetings();
  }

  // Function to handle adding a new attendee to the meeting
  addAttendee(meeting: Imeeting) {
    if (this.selectedEmail.trim() === '') {
      alert('Please select an email from the dropdown!');
      return;
    }

    // Add the selected attendee email
    meeting.attendees.push({ userId: '', email: this.selectedEmail.trim() });

    // Reset the selected email after adding
    this.selectedEmail = '';
    this.filterMeetings();
  }
}