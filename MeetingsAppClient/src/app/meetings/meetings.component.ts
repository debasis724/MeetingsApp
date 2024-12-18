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
  UserData: any[] = [];
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
    this.loadAttendees();
    this.loadMeetings();
  }

  constructor(private router: Router, private meetingsService: MeetingsService) {}

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

  getAttendeeEmail(userId: string): string {
    const user = this.UserData.find(u => u.userId === userId); // Find the user by userId
    return user ? user.email : 'Email not found'; // Return the email or a default message
  }

  // Function to filter meetings
  filterMeetings() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the date

    // Split the search query into individual terms and remove any extra spaces
    const searchTerms = this.searchQuery.trim().toLowerCase().split(/\s+/);

    this.filteredMeetings = this.meetings.filter((meeting: Imeeting) => {
      const meetingDate = new Date(meeting.date); // Convert the meeting's date to a Date object
      meetingDate.setHours(0, 0, 0, 0); // Normalize the meeting's date to 00:00:00 for comparison
  
      const isMatchingDate = meetingDate.getTime() === today.getTime(); // Only include meetings from today
  
      // Check if the meeting matches the selected date filter
      let matchesDate = false;
      if (this.selectedDate === 'today') {
        matchesDate = isMatchingDate; // Only show meetings for today
      } else if (this.selectedDate === 'upcoming') {
        matchesDate = meetingDate > today; // Upcoming meetings
      } else if (this.selectedDate === 'past') {
        matchesDate = meetingDate < today; // Past meetings
      } else {
        matchesDate = true; // Show all meetings if 'all' is selected
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
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  onMeetingAdded(newMeeting: Imeeting) {
    this.meetingsService.addMeeting(newMeeting).subscribe(
      (addedMeeting: Imeeting) => {
        this.loadMeetings();
        this.meetings.push(addedMeeting); // Add the newly created meeting to the meetings array
        this.filterMeetings(); // Re-filter the meetings list after adding
        this.filteredMeetings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);
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
  excuseYourself(meeting: Imeeting) {
    const id = {
      meetingId: meeting.id,
    }
    this.meetingsService.removeAttendee(id).subscribe(
      (response) => {
        console.log('You have been excused from the meeting:', meeting.name);
        // // Remove the meeting from the current meetings list (or update the list)
        // this.meetings = this.meetings.filter(m => m.id !== meeting.id);
        this.meetings = this.meetings.filter(m => m.id !== meeting.id);
        this.filterMeetings(); // Re-filter meetings
      },
      (error) => {
        console.error('Error removing attendee:', error);
        alert('An error occurred while excusing yourself from the meeting.');
      }
    );
  }

  // Function to handle adding a new attendee to the meeting
  addAttendee(meeting: Imeeting) {
    if (this.selectedEmail.trim() === '') {
      alert('Please select an email from the dropdown!');
      return;
    }
    const attendeeData = {
      email: this.selectedEmail,
      meetingId: meeting.id
    }
    // Call the service to add the attendee
    this.meetingsService.addAttendee(attendeeData).subscribe(
      (response) => {
        console.log('Attendee added successfully:', response);
        this.selectedEmail = ''; // Reset the selected email
        meeting.attendees = response.attendees;
        //meeting.attendees?.push({ meetingId: meeting.id, userId: response. });
        this.filterMeetings(); // Re-filter meetings after adding attendee
      },
      (error) => {
        console.error('Error adding attendee:', error);
      }
    );
  }

  loadAttendees(): void {
    this.meetingsService.getUsers().subscribe(
      (response) => {
        this.UserData = response;  // Store the list of attendees (users)
        console.log('Loaded attendees:', this.UserData);
      },
      (error) => {
        console.error('Error loading attendees:', error);
      }
    );
  }
}