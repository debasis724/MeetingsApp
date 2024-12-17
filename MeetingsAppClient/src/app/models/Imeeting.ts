interface Meeting {
  id?: number; // Changed from _id to id to match the backend
  name: string;
  description: string;
  date: string; // ISO date string
  startTime: string; // Time is now represented as a string in "HH:mm" format
  endTime: string; // Same for endTime
  attendees: string[]; // Allow attendees to be null, matching the backend response
}

export default Meeting;