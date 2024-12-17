import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://localhost:7150';

export interface ICredentials {
  username: string;
  password: string;
  roles?: string[];
}

export interface ILoginResponse {
  email: string;
  authToken: string;
  role: 'Writer' | 'Reader';
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private static KEY_USER = 'user';

  private currentUserSubject: BehaviorSubject<ILoginResponse | null>;
  public currentUser: Observable<ILoginResponse | null>;

  constructor(private http: HttpClient) {
    const user = JSON.parse(
      localStorage.getItem(AuthenticationService.KEY_USER) || '{}'
    );

    // const email = JSON.parse(localStorage.getItem(AuthenticationService.KEY_USER) || '{}');
    // const email = localStorage.getItem('userEmail');
    this.currentUserSubject = new BehaviorSubject<ILoginResponse | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: ICredentials) {
    return this.http
      .post<ILoginResponse>(`${apiUrl}/api/Auth/Login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((resp) => {
          if (resp && resp.authToken) {
            // Store user details and JWT token in local storage
            localStorage.setItem(
              AuthenticationService.KEY_USER,
              JSON.stringify(resp)
            );
            this.currentUserSubject.next(resp);
          }
          return resp;
        })
      );
  }
  register(credentials: ICredentials) {
    return this.http
      .post(`${apiUrl}/api/Auth/Register`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((resp) => {
          // Optionally handle registration success (e.g., log in automatically)
          return resp;
        })
      );
  }

  logout() {
    // Remove user from local storage and set current user to null
    localStorage.removeItem(AuthenticationService.KEY_USER);
    this.currentUserSubject.next(null);
  }

  getUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
