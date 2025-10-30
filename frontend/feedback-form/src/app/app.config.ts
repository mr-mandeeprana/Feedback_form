import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: FeedbackFormComponent }
    ])
  ]
};
