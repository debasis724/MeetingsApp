import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { TeamsComponent } from './teams/teams.component';
import { AddMeetingComponent } from './meetings/add-meeting/add-meeting.component';
import { AuthGuard } from './common/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
    title: 'Calendar',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Page',
  },
  {
    path: 'register',
    component: LoginComponent,
    title: 'Register Page',
  },
  {
    path: '',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'meetings',
    component: MeetingsComponent,
    title: 'Meetings',
    canActivate: [AuthGuard]
  },
  {
    path: 'teams',
    component: TeamsComponent,
    title: 'Teams',
    canActivate: [AuthGuard]
  },
  {
    path: 'add-meeting',
    component: AddMeetingComponent,
    title: 'Add Meeting',
    canActivate: [AuthGuard]
  },
  // {
  //     path:'',
  //     // redirectTo:'',
  //     pathMatch:'full',
  //     component:LoginComponent,
  // },
];
