import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router,RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../common/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy {
  userEmail: string = '';
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser observable to get updates when the user logs in or out
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        // Set the user email when user object is available
        this.userEmail = user.email;
      } else {
        // Reset the email when the user logs out
        this.userEmail = '';
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks when the component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}