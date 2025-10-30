import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = 'http://localhost:5000/api/feedback';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:5000');
  }

  submitFeedback(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // ✅ New method: request OTP
  requestOtp(email: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/otp/request`, { email });
  }

  // ✅ New method: verify OTP
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/otp/verify`, { email, otp });
  }

  // ✅ New method: register for real-time OTP
  registerForOTP(email: string) {
    this.socket.emit('register-otp', email);
  }

  // ✅ New method: listen for real-time OTP
  onOTPReceived(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('otp-received', (data) => {
        observer.next(data);
      });
    });
  }
}
