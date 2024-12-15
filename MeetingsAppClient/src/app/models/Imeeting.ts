interface Attendee {
  userId: string;
  email: string;
}

interface Time {
  hours: number;
  minutes: number;
}

interface Meeting {
  _id?: string;
  name: string;
  description: string;
  date: string; // ISO date string
  startTime: Time;
  endTime: Time;
  attendees: Attendee[];
}

export type { Attendee, Time };
export default Meeting; 
