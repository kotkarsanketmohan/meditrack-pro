<div align="center">
  <h1 align="center">MediTrack Pro</h1>
  <p align="center">
    <strong>A Comprehensive Healthcare & Pharmacy Management System</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
    <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

---

## 📖 Overview

MediTrack Pro is an advanced Healthcare Ecosystem designed to streamline pharmacy operations, secure sensitive data, and provide rapid, cross-platform accessibility. It helps pharmacies efficiently manage their day-to-day tasks, from tracking stock levels to analyzing financial performance and patient purchase histories.

---

## 🎥 Demo

<a href="https://youtu.be/5zvdKq4EkAM?si=Plr5pkZ0LP9KtR44" target="_blank">
  <img src="./frontend/public/thumbnail.jpg" alt="MediTrack Pro Dashboard Preview" width="100%" />
</a>

▶️ [Watch the Project Demo](https://youtu.be/5zvdKq4EkAM?si=Plr5pkZ0LP9KtR44)

---

## ✨ Features

* **Interactive Dashboard:** Real-time analytics and data visualization to monitor overall pharmacy or healthcare performance at a glance.
* **Income Reports:** Detailed financial tracking and reporting to help manage revenue and understand business growth.
* **Medical Patient Purchase History:** Comprehensive records of patient purchases to ensure accurate medical history tracking and seamless service.
* **Smart Stock & Inventory Analytics:** Automated stock tracking operating with dynamic sorting algorithms based on real-time medicine availability and selling frequency to prevent critical supply stockouts.
* **Secure Authentication:** JWT-based secure user authentication and registration system.
* **Email Notifications:** Automated activation and welcome emails to enhance user onboarding.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React
* **Build Tool:** Vite
* **Styling:** Tailwind CSS

### Backend
* **Core Engine:** Java 17+
* **Framework:** Spring Boot (Spring Web, Spring Security, Spring Data JPA)
* **Authentication:** JWT

### Database
* **RDBMS:** PostgreSQL

---

## 📂 Project Structure

```text
MediTrack Pro/
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Java source code (Controllers, Services, Repositories, Entities)
│   ├── src/main/resources/   # Application properties and configurations
│   └── pom.xml               # Maven dependencies
└── frontend/                 # React frontend application
    ├── src/                  # React components, views, api configs, and styles
    ├── public/               # Static assets
    ├── package.json          # Node dependencies
    └── vite.config.js        # Vite configuration
```

---

## 🚀 Installation & Running Guide

Follow these steps to establish a local development environment for MediTrack Pro.

### Prerequisites
* Java Development Kit (JDK) 17 or higher
* Node.js (v18+)
* PostgreSQL running locally on port `5432`

### 1. Database Setup
1. Open PostgreSQL (using pgAdmin or terminal).
2. Create a new database named `meditrack`.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Ensure you have configured your environment properties (database credentials, email API keys, etc.) in `application.properties` or a `.env` file.
3. Start the Spring Boot server:
   ```bash
   mvn clean spring-boot:run
   ```
   *The backend will boot on port `8080` (or the port defined in your properties), serving the RESTful API endpoints.*

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install the JavaScript dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend directory and define your backend API URL if needed (e.g., `VITE_API_BASE_URL=http://localhost:8080/api`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The local React environment will spin up on `http://localhost:5173`.*

---

## 📝 Author 

**Project:** MediTrack Pro - Comprehensive Healthcare & Pharmacy Management System  
**Author:** Sanket Mohan Kotkar  

