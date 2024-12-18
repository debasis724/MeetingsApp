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
import Imeeting from '../../models/Imeeting';

@Component({
  selector: 'app-add-meeting',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-meeting.component.html',
  styleUrl: './add-meeting.component.scss'
})
export class AddMeetingComponent {
//   @Output() meetingAdded: EventEmitter<Imeeting> = new EventEmitter<Imeeting>();
//   addMeetingForm: FormGroup;
//   hours: number[] = [];
//   minutes: number[] = [];

//   constructor(private fb: FormBuilder) {
//     // Initialize form group with controls corresponding to Meeting interface
//     this.addMeetingForm = this.fb.group({
//       name: ['', Validators.required],
//       date: ['', Validators.required],
//       startTime: this.fb.group({
//         hours: [0, Validators.required],  // FormControl for startTime.hours
//         minutes: [0, Validators.required] // FormControl for startTime.minutes
//       }),
//       endTime: this.fb.group({
//         hours: [0, Validators.required],  // FormControl for endTime.hours
//         minutes: [0, Validators.required] // FormControl for endTime.minutes
//       }),
//       description: ['', Validators.required],
//       attendees: ['', [Validators.required]]  // Can be a comma-separated string of emails or short names
//     });

//     // Populate hours and minutes arrays
//     this.hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 for hours
//     this.minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59 for minutes
//   }

//   ngOnInit(): void {}

//   // submitMeeting(): void {
//   //   if (this.addMeetingForm.valid) {
//   //     const formData = this.addMeetingForm.value;

//   //     // Construct the meeting object using the form data
//   //     const meeting: Omit<Imeeting, '_id'> = {
//   //       name: formData.name,
//   //       description: formData.description,
//   //       date: formData.date,
//   //       startTime: formData.startTime,  // Ensure it's typed as Time
//   //       endTime: formData.endTime,      // Ensure it's typed as Time
//   //       attendees: formData.attendees.split(',').map((email: string) => ({
//   //         userId: '',  // This would be generated or fetched from a database based on email
//   //         email: email.trim()
//   //       }))
//   //     };
//   //     this.meetingAdded.emit(meeting);
//   //     console.log('Meeting Data:', meeting);
//   //     // Call a service to save the meeting or handle the meeting data further...
//   //   }
//   // }
// }
@Output() meetingAdded: EventEmitter<Imeeting> = new EventEmitter<Imeeting>();
  addMeetingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addMeetingForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],  // Start time as a string (hh:mm)
      endTime: ['', Validators.required],    // End time as a string (hh:mm)
      description: ['', Validators.required],
      emails: ['', [Validators.required]]  // Comma-separated email addresses
    });
  }

  ngOnInit(): void {}

  // Handle form submission
  submitMeeting(): void {
    if (this.addMeetingForm.valid) {
      const formData = this.addMeetingForm.value;

      // Construct the meeting object using the form data
      const meeting: Imeeting = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,  // Directly use the time string (hh:mm)
        endTime: formData.endTime,      // Directly use the time string (hh:mm)
        emails: this.parseAttendees(formData.emails) // Only emails here
      };

      // Emit the meeting data
      this.meetingAdded.emit(meeting);
      console.log('Meeting Data:', meeting);
    }
  }

  // Helper function to parse attendees string into an array of email strings
  parseAttendees(emails: string): string[] {
    return emails.split(',')
      .map(email => email.trim())
      .filter(email => email); // Remove any empty strings
  }

  // Input event handler to format time as "hh:mm"
  onTimeInput(event: any, controlName: string): void {
    let value = event.target.value.replace(/[^0-9:]/g, '');  // Remove non-numeric characters except for ':'
    if (value.length > 2 && value.indexOf(":") === -1) {
      value = value.slice(0, 2) + ":" + value.slice(2, 4);
    }
    this.addMeetingForm.get(controlName)?.setValue(value);
  }

  // Focus handler to remove the default "00:00" if not yet edited
  onFocus(event: any, controlName: string): void {
    if (event.target.value === "00:00") {
      event.target.value = "";  // Clear if "00:00" is the default value
    }
  }

  // Blur event: reset to "00:00" if empty
  onBlur(event: any, controlName: string): void {
    if (!event.target.value) {
      event.target.value = "00:00";
      this.addMeetingForm.get(controlName)?.setValue("00:00");  // Reset form control value
    }
  }
}