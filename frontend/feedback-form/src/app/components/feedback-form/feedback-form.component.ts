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


  constructor(
    private feedbackService: FeedbackService,
    private designationService: DesignationService,
    private cdRef: ChangeDetectorRef,
    private cementCompanyService: CementCompanyService,
    private snackBar: MatSnackBar
  ) {}

  

  ngOnInit(): void {
    this.fetchDesignations();

    // Real-time features can be added here later
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

  // OTP functionality removed

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

    console.log('Submitting feedback', payload);

    this.feedbackService.submitFeedback(payload).subscribe({
      next: () => {
        console.log('Feedback submitted successfully');
        this.showSnackBar('✅ Feedback submitted successfully!');

      },
      error: (error) => {
        console.log('Failed to submit feedback', error);
        this.showSnackBar('❌ Failed to submit feedback.')
      }
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
  return this.currentSection === this.maxSections - 1;
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
    // OTP properties removed, no reset needed
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

