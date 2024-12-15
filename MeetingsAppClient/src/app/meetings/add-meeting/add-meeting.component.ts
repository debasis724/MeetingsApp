import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Imeeting, { Attendee, Time } from '../../models/Imeeting';

@Component({
  selector: 'app-add-meeting',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-meeting.component.html',
  styleUrl: './add-meeting.component.scss'
})
export class AddMeetingComponent {
  @Output() meetingAdded: EventEmitter<Imeeting> = new EventEmitter<Imeeting>();
  addMeetingForm: FormGroup;
  hours: number[] = [];
  minutes: number[] = [];

  constructor(private fb: FormBuilder) {
    // Initialize form group with controls corresponding to Meeting interface
    this.addMeetingForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      startTime: this.fb.group({
        hours: [0, Validators.required],  // FormControl for startTime.hours
        minutes: [0, Validators.required] // FormControl for startTime.minutes
      }),
      endTime: this.fb.group({
        hours: [0, Validators.required],  // FormControl for endTime.hours
        minutes: [0, Validators.required] // FormControl for endTime.minutes
      }),
      description: ['', Validators.required],
      attendees: ['', [Validators.required]]  // Can be a comma-separated string of emails or short names
    });

    // Populate hours and minutes arrays
    this.hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 for hours
    this.minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59 for minutes
  }

  ngOnInit(): void {}

  submitMeeting(): void {
    if (this.addMeetingForm.valid) {
      const formData = this.addMeetingForm.value;

      // Construct the meeting object using the form data
      const meeting: Omit<Imeeting, '_id'> = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime as Time,  // Ensure it's typed as Time
        endTime: formData.endTime as Time,      // Ensure it's typed as Time
        attendees: formData.attendees.split(',').map((email: string) => ({
          userId: '',  // This would be generated or fetched from a database based on email
          email: email.trim()
        }))
      };
      this.meetingAdded.emit(meeting);
      console.log('Meeting Data:', meeting);
      // Call a service to save the meeting or handle the meeting data further...
    }
  }
}
