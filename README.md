# 📝 Beumer Group – Customer Feedback Form (v9)

A professional, multi-step feedback form for Beumer Group customers, built using **Angular 20** (frontend) and **Node.js + Express** (backend), connected to **MongoDB**. This form supports OTP verification, conditional product feedback sections (Fill Pac / Bucket Elevator), and saves all data securely to the database.

---

## 📁 Project Structure

<img width="917" height="209" alt="image" src="https://github.com/user-attachments/assets/188ef514-483e-41a8-be29-5f733dacc7a9" />

---

## ⚙️ Features

✅ Angular Material UI with stepper and custom styling  
✅ OTP-based email verification (user cannot proceed without OTP)  
✅ Dynamic dropdowns (Country → Company, Designation)  
✅ Conditional product sections:
  - *Fill Pac* → (OEE dashboard questions)
  - *Bucket Elevator* → (Condition Monitoring dashboard questions)
 
✅ Validations on all fields  
✅ Success message after submission  

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js v18+
- Angular CLI v20+
- MongoDB (local or cloud instance like Atlas, Compass)
  
---

### 1️⃣ Clone the Repo

```bash
git clone -b Version9 https://github.com/mr-mandeeprana/Feedback_form.git
cd Feedback-Form-Project
```
---

### 2️⃣ Setup Backend

```bash
cd feedback-backend
npm install
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
cd feedback-form
cd src
cd app
npm install
ng serve
```
### Visit: http://localhost:4200
---

### 📸 Screenshots
### 🧾 Section A: Company Details
Includes country → company dropdown
<img width="1143" height="885" alt="image" src="https://github.com/user-attachments/assets/e1cf50e1-a8eb-460e-ae7a-845fe8454204" />

### 🔐 Section B: Contact + OTP Verification
User must verify email before continuing
<img width="1119" height="877" alt="image" src="https://github.com/user-attachments/assets/67f2998e-6101-4a5c-890e-daf611ee0418" />

### 🏭 Section C: Product Info
Conditionally shows Fill Pac / Bucket Elevator / both
<img width="1013" height="778" alt="image" src="https://github.com/user-attachments/assets/117c1358-76aa-43c5-9073-302383e8acd1" />

### 📊 Section D: Feedback Questions
Includes star rating, text input, checkboxes, OEE questions, CM question
<img width="1006" height="871" alt="image" src="https://github.com/user-attachments/assets/e0b86433-54ff-4b2a-85a5-90d726807c9d" />
---

### 👤 Author
Drishti Joshi – Big Data Engineer, passionate about combining industrial reliability with modern web tools.
### Editor
Mandeep Rana - Data Analyst and Ai Engineer
---

### 📄 License
This project is for internal use by Beumer Group. Not for commercial redistribution.


