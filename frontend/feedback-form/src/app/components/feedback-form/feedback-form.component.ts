import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackService } from '../../feedback.service';
import { DesignationService } from '../../designation.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CementCompanyService } from '../../cement-company.service';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule
  ],
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css'],
})
export class FeedbackFormComponent implements OnInit {
  Object = Object;
  currentSection = 0;
  maxSections = 4;
  today: string = new Date().toISOString().split('T')[0];
  numberOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  fillPacUnits: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  fillPacMonitoredUnits: number[] = [];
  monitoredFillPacArray: any[] = [];

  bucketElevatorUnits: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  bucketElevatorMonitoredUnits: number[] = [];
  monitoredBucketElevatorArray: any[] = [];


  othercementcompany: string = '';
  showOthercementcompany = false;
  isSubmitted = false;



  formData: any = {
  name: '',
  number: '',
  email: '',
  designation: '',
  country: '',
  company: '',
  othercementcompany: '',
  plantlocation: '',

  selectedProducts: [],

fillPac: {
  totalUnits: null,
  monitoredUnits: null,
  unitDetails: [],
  oeeDataAccurate: '',
  oeeInaccuracyDetails: '',
  performanceAccurate: '',
  performanceInaccuracyDetails: '',
  qualityAccurate: '',
  qualityInaccuracyDetails: '',
  availabilityAccurate: '',
  availabilityInaccuracyDetails: '',
  bagCountMatch: '',
  bagCountMismatchDetails: '',
  dataUpdate: '',
  bottleneckHelp: '',
  usefulMetric: '',
  missingFeatures: '',
  missingFeatureDetails: '',
  additionalVisualizations: '',
  alerts: '',
  faultIdleTimeHelpful: '',
  bagInfoHelpful: '',
  additionalComments: '',
  userFriendly: '',
},


  bucketElevator: {
    totalUnits: null,
    monitoredUnits: null,
    unitDetails: [],
    feedback: {
      implementationUnderstanding: '',
      failureIdentification: '',
      training: '',
      dashboardUsability: '',
      maintenanceImpact: '',
      downtimeReduction: '',
      supportExperience: '',
      suggestions: ''
    }
    }
};


  designations: string[] = [];
  showOtherDesignation = false;
  otherDesignation = '';

  countriesWithCompanies: Record<string, string[]> = {
    India: ['UltraTech', 'ACC', 'Ambuja', 'Shree Cement', 'Dalmia Bharat', 'JK Cement', 'Ramco Cements', 'India Cements', 'Birla Corporation', 'Orient Cement', 'Other'],
    USA: ['Cemex USA', 'Lafarge North America', 'Lehigh Hanson', 'Ash Grove Cement', 'CalPortland', 'Argos USA', 'Martin Marietta', 'Eagle Materials', 'Other'],
    Germany: ['HeidelbergCement', 'Dyckerhoff', 'Schwenk Zement', 'Holcim Germany', 'Opterra', 'Spenner Zement', 'Other'],
    China: ['Anhui Conch', 'CNBM', 'Sinoma', 'Jidong Development', 'Taiyuan Lionhead Cement', 'Tianshan Cement', 'Huaxin Cement', 'Tangshan Jidong Cement', 'Other'],
    France: ['Lafarge', 'Vicat', 'Holcim France', 'Calcia', 'Ciments Kercim', 'Other'],
    Brazil: ['Votorantim Cimentos', 'InterCement', 'CSN Cimentos', 'Cimento Apodi', 'Cimpor', 'Other'],
    Japan: ['Taiheiyo Cement', 'Sumitomo Osaka Cement', 'Ube Industries', 'Tokuyama Cement', 'Mitsubishi Materials', 'Other'],
    Mexico: ['Cemex', 'Moctezuma Cement', 'Cruz Azul Cement', 'LafargeHolcim Mexico', 'Other'],
    Nigeria: ['Dangote Cement', 'BUA Cement', 'Lafarge Africa', 'UNICEM', 'Ashaka Cement', 'Other'],
    Thailand: ['Siam Cement Group (SCG)', 'TPI Polene', 'Siam City Cement', 'INSEE Cement Thailand', 'Other'],
    UAE: ['National Cement Co.', 'Union Cement Company', 'Gulf Cement Company', 'RAK Cement', 'Sharjah Cement Factory', 'Other'],
    Italy: ['Buzzi Unicem', 'Italcementi', 'Cementir Holding', 'Colacem', 'Other'],
    Russia: ['Eurocement Group', 'Novoroscement', 'Sibtsem', 'Mordovcement', 'Other'],
    Malaysia: ['YTL Cement', 'CIMA (Cement Industries of Malaysia)', 'Lafarge Malaysia', 'Tasek Corporation', 'Other'],
    SouthAfrica: ['PPC Ltd', 'AfriSam', 'Lafarge South Africa', 'NPC InterCement', 'Other'],
    UK: ['Breedon Group', 'Tarmac', 'Hanson UK', 'Cemex UK', 'Hope Cement', 'Other'],
    Canada: ['Lafarge Canada', 'St Marys Cement', 'Lehigh Hanson Canada', 'Ash Grove Canada', 'Other'],
    Australia: ['Adbri Limited', 'Boral Cement', 'Cement Australia', 'Independent Cement & Lime', 'Other']
  };

  cementCompanies: string[] = [];

  otpSent = false;
  otpVerified = false;
  otpError = false;
  enteredOtp = '';
  userEmail: string = '';
  otpStatusMessage: string = '';
  otpStatusType: 'success' | 'error' | '' = '';
  otpExpirationTime: number = 0;
  otpCountdown: number = 0;
  private otpTimer: any;

  constructor(
    private feedbackService: FeedbackService,
    private designationService: DesignationService,
    private cdRef: ChangeDetectorRef,
    private cementCompanyService: CementCompanyService,
    private snackBar: MatSnackBar
  ) {}

  

  ngOnInit(): void {
    this.fetchDesignations();

    // Listen for real-time OTP
    this.feedbackService.onOTPReceived().subscribe((data: any) => {
      if (data.otp) {
        this.enteredOtp = data.otp;
        this.onOtpInputChange(); // Auto-verify
        console.log('Real-time OTP received and auto-filled:', data.otp);
      }
    });
  }

  fetchDesignations() {
    const defaultList = ['Maintenance Engineer', 'Plant Head', 'Mechanical Engineer'];

    this.designationService.getDesignations().subscribe({
      next: (data: any[]) => {
        const dbList = data.filter(v => typeof v === 'string' && v.trim());
        const merged = [...new Set([...defaultList, ...dbList, 'Other'])];
        this.designations = merged;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.designations = [...defaultList, 'Other'];
        this.cdRef.detectChanges();
      }
    });
  }

  blockNumbers(event: KeyboardEvent) {
  const inputChar = String.fromCharCode(event.keyCode);
  if (/\d/.test(inputChar)) {
    event.preventDefault(); // block the key press
  }
}


  showSnackBar(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snack-bar-style']
    });
  }

  checkOtherDesignation() {
    this.showOtherDesignation = this.formData.designation === 'Other';
  }

  onCountryChange() {
  const defaultList = this.countriesWithCompanies[this.formData.country] || [];

  this.cementCompanyService.getCompanies(this.formData.country).subscribe({
    next: (data: any[]) => {
      const dbList = data.map(c => c.name);
      this.cementCompanies = [...new Set([...defaultList, ...dbList, 'Other'])];
      this.cdRef.detectChanges();
    },
    error: () => {
      this.cementCompanies = [...defaultList, 'Other'];
      this.cdRef.detectChanges();
    }
  });

  this.formData.company = '';
  this.showOthercementcompany = false;
}


  onCompanyChange(selected: string) {
    this.showOthercementcompany = selected === 'Other';
    if (!this.showOthercementcompany) {
      this.formData.othercementcompany = '';
    }
  }

  preventEnterSubmit(event: Event) {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.key === 'Enter') {
    keyboardEvent.preventDefault();
  }
}

  goToNext() {
  const formControls = document.querySelectorAll('form input, form select, form textarea');
  let isValid = true;

  formControls.forEach((control: any) => {
    if (control.offsetParent !== null && !control.checkValidity()) {
      control.reportValidity();
      isValid = false;
    }
  });

  if (this.currentSection === 0) {
    if (!this.formData.country || !this.formData.company ||
      (this.formData.company === 'Other' && !this.formData.othercementcompany)) {
      this.showSnackBar('⚠️ Please select a country and a company (or specify Other).');
      return;
    }
  }

  if (this.currentSection === 1) {
    if (!this.formData.designation ||
        (this.formData.designation === 'Other' && !this.otherDesignation.trim())) {
      this.showSnackBar('⚠️ Please select a valid designation or enter your own.');
      return;
    }
    if (!this.otpSent) {
      this.showSnackBar('⚠️ Please request OTP first.');
      return;
    }
    if (!this.otpVerified) {
      this.showSnackBar('⚠️ Please verify the OTP before continuing.');
      return;
    }
  }

  if (isValid) {
    this.currentSection++;
  }
}


  goToPrevious() {
    if (this.currentSection > 0) {
      this.currentSection--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onProductToggle(event: any) {
  const product = event.target.value;
  if (event.target.checked) {
    this.formData.selectedProducts.push(product);
  } else {
    const index = this.formData.selectedProducts.indexOf(product);
    if (index > -1) this.formData.selectedProducts.splice(index, 1);
  }
}

onFillPacUnitCountChange() {
  const total = this.formData.fillPac.totalUnits || 0;
  if (total < 0 || total > 10) {
    this.showSnackBar('⚠️ Total units must be between 1 and 10.');
    this.formData.fillPac.totalUnits = null;
    return;
  }
  this.fillPacMonitoredUnits = Array.from({ length: total }, (_, i) => i + 1);
  this.formData.fillPac.monitoredUnits = null;
  this.monitoredFillPacArray = [];
  this.formData.fillPac.unitDetails = [];
}

onFillPacMonitoringCountChange() {
  const total = this.formData.fillPac.totalUnits || 0;
  const monitored = this.formData.fillPac.monitoredUnits || 0;

  if (monitored < 0 || monitored > total) {
    this.showSnackBar('⚠️ Monitored units cannot exceed total units.');
    this.formData.fillPac.monitoredUnits = null;
    return;
  }

  this.monitoredFillPacArray = Array.from({ length: monitored });
  this.formData.fillPac.unitDetails = Array.from({ length: monitored }, (_, i) => ({
    id: `FillPac-${i + 1}`,
    installationDate: '',
    functionFeedback: '',
    speedFeedback: '',
    clampingIssues: '',
    suggestions: '',
    spouts: '',        // ✅ New field
    documents: []
  }));
}
  onBucketElevatorUnitCountChange() {
    const total = this.formData.bucketElevator.totalUnits || 0;
    if (total < 0 || total > 10) {
      this.showSnackBar('⚠️ Total units must be between 1 and 10.');
      this.formData.bucketElevator.totalUnits = null;
      return;
    }
    this.bucketElevatorMonitoredUnits = Array.from({ length: total }, (_, i) => i + 1);
    this.formData.bucketElevator.monitoredUnits = null;
    this.monitoredBucketElevatorArray = [];
    this.formData.bucketElevator.unitDetails = [];
  }

  onBucketElevatorMonitoringCountChange() {
    const total = this.formData.bucketElevator.totalUnits || 0;
    const monitored = this.formData.bucketElevator.monitoredUnits || 0;

    if (monitored < 0 || monitored > total) {
      this.showSnackBar('⚠️ Monitored units cannot exceed total units.');
      this.formData.bucketElevator.monitoredUnits = null;
      return;
    }

    this.monitoredBucketElevatorArray = Array.from({ length: monitored });
    this.formData.bucketElevator.unitDetails = Array.from({ length: monitored }, (_, i) => ({
      id: `BucketElevator-${i + 1}`,
      installationDate: '',
      functionFeedback: '',
      beltSlippage: '',
      maintenanceFeedback: '',
      suggestions: '',
      elevatorType: '',  // ✅ New field
      documents: []
    }));

    this.formData.bucketElevator = this.formData.bucketElevator || {};
    this.formData.bucketElevator.feedback = {
      implementationUnderstanding: '',
      failureIdentification: '',
      training: '',
      dashboardUsability: '',
      maintenanceImpact: '',
      downtimeReduction: '',
      supportExperience: '',
      suggestions: ''
    };
  }

onDocCheckboxChange(event: any, documentsArray: string[]) {
  const value = event.target.value;
  if (event.target.checked) {
    if (!documentsArray.includes(value)) {
      documentsArray.push(value);
    }
  } else {
    const index = documentsArray.indexOf(value);
    if (index !== -1) {
      documentsArray.splice(index, 1);
    }
  }
}



  showFillPacFeedback(): boolean {
    return this.formData.selectedProducts.includes('Fill Pac');
  }

  showBucketElevatorFeedback(): boolean {
    return this.formData.selectedProducts.includes('Bucket Elevator');
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  sendOtp() {
    if (this.otpSent) {
      return;
    }

    // Email validation - allow standard email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      this.showSnackBar('⚠️ Please enter a valid email address.');
      return;
    }

    this.otpSent = true; // Disable button immediately to prevent multiple clicks
    this.clearOtpTimer(); // Clear any existing timer

    this.feedbackService.requestOtp(this.formData.email).subscribe({
      next: (response: any) => {
        this.otpSent = true;
        this.otpVerified = false;
        this.otpError = false;
        this.otpStatusMessage = response.message || 'OTP sent successfully!';
        this.otpStatusType = 'success';
        this.startOtpCountdown();
      },
      error: (error: any) => {
        this.otpSent = false; // Re-enable button on error
        this.otpStatusMessage = error.error?.message || 'Failed to send OTP. Try again.';
        this.otpStatusType = 'error';
        this.otpCountdown = 0;
      }
    });
  }

  verifyOtp() {
    // Validate OTP format (6 characters - can be letters, numbers, mixed case)
    if (!this.enteredOtp || this.enteredOtp.length !== 6) {
      this.showSnackBar('⚠️ Please enter a valid 6-character OTP.');
      return;
    }

    this.feedbackService.verifyOtp(this.formData.email, this.enteredOtp).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.otpVerified = true;
          this.otpError = false;
          this.otpStatusMessage = res.message || 'OTP verified successfully!';
          this.otpStatusType = 'success';
        } else {
          this.otpVerified = false;
          this.otpError = true;
          this.otpStatusMessage = res.message || 'Invalid OTP. Please try again.';
          this.otpStatusType = 'error';
        }
      },
      error: (error: any) => {
        this.otpVerified = false;
        this.otpError = true;
        this.otpStatusMessage = error.error?.message || 'Error verifying OTP.';
        this.otpStatusType = 'error';
      }
    });
  }

  // Allow only numeric input for OTP field
  allowOnlyNumbersForOtp(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // Auto-verify OTP when 6 digits entered
  onOtpInputChange() {
    if (this.enteredOtp.length === 6) {
      this.verifyOtp();
    }
  }

  // Start OTP countdown timer
  startOtpCountdown() {
    this.otpExpirationTime = Date.now() + (5 * 60 * 1000); // 5 minutes from now
    this.otpCountdown = 5 * 60; // 5 minutes in seconds

    this.otpTimer = setInterval(() => {
      this.otpCountdown--;
      if (this.otpCountdown <= 0) {
        this.clearOtpTimer();
        this.otpCountdown = 0;
        // Optionally show expiration message
        if (!this.otpVerified) {
          this.otpStatusMessage = 'OTP expired. Please request a new one.';
          this.otpStatusType = 'error';
        }
      }
      this.cdRef.detectChanges();
    }, 1000);
  }

  // Clear OTP timer
  clearOtpTimer() {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = null;
    }
  }

  // Format countdown as MM:SS
  getCountdownDisplay(): string {
    const minutes = Math.floor(this.otpCountdown / 60);
    const seconds = this.otpCountdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onSubmit() {
    if (this.showOtherDesignation && this.otherDesignation) {
      this.formData.designation = this.otherDesignation.trim();
      this.saveDesignation(this.otherDesignation);
    }

    if (this.showOthercementcompany && this.formData.othercementcompany) {
    this.formData.company = this.formData.othercementcompany.trim();
    this.saveCementCompany(this.formData.othercementcompany); // 👈 call this
  }

    const payload = { ...this.formData };

    this.feedbackService.submitFeedback(payload).subscribe({
      next: () => this.showSnackBar('✅ Feedback submitted successfully!'),
      error: () => this.showSnackBar('❌ Failed to submit feedback.')
    });

    this.resetForm(); // 👈 Reset after successful submission
    this.isSubmitted = true; // ✅ Show Thank You section
  }

  saveDesignation(newDes: string) {
  this.designationService.addDesignation({ designation: newDes }).subscribe({
    next: () => {
      console.log('✅ New designation saved to DB');

      // 🔁 Only fetch after saving to ensure it's available
      this.fetchDesignations();
    },
    error: (err) => console.error('❌ Failed to save designation:', err)
  });
}

isFormComplete(): boolean {
  return this.currentSection === this.maxSections - 1 && this.otpVerified;
}

saveCementCompany(newCompany: string) {
  const country = this.formData.country;
  this.cementCompanyService.addCompany(newCompany.trim(), country).subscribe({
    next: () => {
      console.log('✅ New cement company saved to DB for', country);
      this.onCountryChange(); // re-fetch updated list
    },
    error: (err) => console.error('❌ Failed to save cement company:', err)
  });
}

submitAnotherResponse() {
  this.resetForm();
  this.isSubmitted = false; // Show the form again
}



  resetForm() {
    this.formData = {
      name: '',
      number: '',
      email: '',
      designation: '',
      country: '',
      company: '',
      othercementcompany: '',
      plantlocation: '',
      selectedProducts: [],
      fillPac: {
        totalUnits: null,
        monitoredUnits: null,
        unitDetails: [],
        oeeDataAccurate: '',
        oeeInaccuracyDetails: '',
        performanceAccurate: '',
        performanceInaccuracyDetails: '',
        qualityAccurate: '',
        qualityInaccuracyDetails: '',
        availabilityAccurate: '',
        availabilityInaccuracyDetails: '',
        bagCountMatch: '',
        bagCountMismatchDetails: '',
        dataUpdate: '',
        bottleneckHelp: '',
        usefulMetric: '',
        missingFeatures: '',
        missingFeatureDetails: '',
        additionalVisualizations: '',
        alerts: '',
        faultIdleTimeHelpful: '',
        bagInfoHelpful: '',
        additionalComments: '',
        userFriendly: '',
      },
      bucketElevator: {
        totalUnits: null,
        monitoredUnits: null,
        unitDetails: [],
        feedback: {
          implementationUnderstanding: '',
          failureIdentification: '',
          training: '',
          dashboardUsability: '',
          maintenanceImpact: '',
          downtimeReduction: '',
          supportExperience: '',
          suggestions: ''
        }
      }
    };

    this.otherDesignation = '';
    this.showOtherDesignation = false;
    this.showOthercementcompany = false;
    this.cementCompanies = [];
    this.enteredOtp = '';
    this.otpSent = false;
    this.otpVerified = false;
    this.otpError = false;
    this.otpStatusMessage = '';
    this.otpStatusType = '';
    this.otpCountdown = 0;
    this.clearOtpTimer();
    this.currentSection = 0;
    this.fillPacUnits = Array.from({ length: 10 }, (_, i) => i + 1);
    this.bucketElevatorUnits = Array.from({ length: 10 }, (_, i) => i + 1);
    this.fillPacMonitoredUnits = [];
    this.bucketElevatorMonitoredUnits = [];
    this.monitoredFillPacArray = [];
    this.monitoredBucketElevatorArray = [];
    this.isSubmitted = false;
window.scrollTo({ top: 0, behavior: 'smooth' });
this.cdRef.detectChanges();
}
}

