import { Component } from '@angular/core';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FeedbackFormComponent],
  template: `<app-feedback-form></app-feedback-form>`,
})
export class AppComponent {}
