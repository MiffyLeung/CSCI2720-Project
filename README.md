# CSCI2720 Project - 2024R1 Group 5

## Group Members

| Name                 | Student ID |
| -------------------- | ---------- |
| LEUNG Pui Ying       | 1155212116 |
| MO Sheung            | 1155212956 |
| TANG Yuk Yee         | 1155176025 |
| ZHUMAGALEYEV Alikhan | 1155184239 |



## Project Overview

This repository contains the project for the **CSCI2720** course, developed by **Group 5 (2024R1)**. The project aims to create a user-friendly web application for managing cultural program locations. It adheres to the course requirements and guidelines, demonstrating collaborative efforts and technical implementation.



## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Technologies Used](#technologies-used)
6. [Development Environment](#development-environment)
7. [Data Source](#data-source)
8. [Contributors](#contributors)
9. [License](#license)



## Introduction

This project focuses on solving the challenge of simplifying cultural event management for users and administrators. It provides functionalities such as location browsing, event searching, and admin control, ensuring a seamless Single Page Application (SPA) experience.



## Features

- **User Authentication**: Secure login and registration for users and admins.
- **Location Management**: Search, browse, and filter cultural program locations dynamically.
- **Admin Panel**: Full CRUD operations for managing users and locations.
- **Interactive Map**: Display locations on a map using the open-source Leaflet.js library.
- **Responsive Design**: Ensures usability across desktop and mobile devices.



## Installation

Follow these steps to set up the project:

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **MongoDB**: A running instance of MongoDB is required for the backend.

The following software and versions are used to ensure consistency during development and testing:

- **Node.js**: v18.17.0
- **npm**: v8.19.2
- **MongoDB**: v7.0.2



### Development Environment

This project uses separate folder structures for the frontend and backend for modular development:

* ​**Frontend**​: Built using ES modules (Typescript) to leverage tree-shaking and smaller bundle sizes. This ensures compatibility with modern browsers and front-end frameworks like React.
* ​**Backend**​: Utilizes CommonJS modules (Javascript) for maximum compatibility with Node.js and existing middleware packages.

To streamline development, the `concurrently` library is used to run both frontend and backend servers simultaneously, improving efficiency during iterative development.

### Steps

1. Clone the repository:
   
   ```bash
   git clone https://github.com/MiffyLeung/CSCI2720-Project.git
   ```
2. **Edit** the content inside `sample.env` to meet your enivorment, and then **Rename** `sample.env` as `.env`
3. Navigate to the project directory: `cd CSCI2720-Project`
4. Install dependencies in each folder:
   
   - **Root**:   `npm install`
   - **Backend**:     `cd backend`       `npm install`    `cd ..`
   - **Frontend**:     `cd frontend`      `npm install`    `cd ..`
5. Start the backend server:
   
   ```bash
   npm start-backend
   ```
6. Start the frontend development server:
   
   ```bash
   npm start-frontend
   ```
## Usage

Once the project is running:

1. Access the application:
   
   - **Frontend**: Open [http://localhost:3000](http://localhost:3000).
   - **Backend API**: The backend runs at [http://localhost:5000](http://localhost:5000).
2. Log in as a user or admin:
   
   - **User Login**: Access basic functionalities like browsing locations and events.
   - **Admin Login**: Access advanced functionalities, including CRUD operations.
3. Explore features:
   
   - View locations on an interactive map.
   - Manage users and locations via the admin panel.
   - Search, filter, and view detailed event information.



## Technologies Used

- **Frontend**: `React`, `TypeScript`, `Axios`, `Webpack`
- **Backend**: `Node.js`, `Express`, `Mongoose`
- **Database**: `MongoDB`
- **Map API**: `Leaflet.js`
  - **Reason**: Leaflet is an open-source map library that does not require an API key or account registration, unlike `Google Maps` or `Mapbox`, which both require a credit card for their free-tier accounts.
- **Utilities**: `Concurrently`
  - Used to simultaneously run both the frontend and backend servers, simplifying development workflows.



## Data Source

This project uses publicly available real-world data from the following dataset:

- **Dataset**: Cultural Programmes
- **Source**: [https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural](https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural)

The dataset contains information about cultural programs, including details like program titles, venues, dates, descriptions, and presenters.



## Contributors

This project was collaboratively developed by **Group 5 (2024R1)** for the **CSCI2720** course.

| **Name**                   | **Role/Responsibilities**                |
| ------------------------ | ------------------------------------ |
| **LEUNG Pui Ying**       | Full-stack support and testing   |
| **MO Sheung**            | Backend API and database integration |
| **TANG Yuk Yee**         | Frontend development and UI design       |
| **ZHUMAGALEYEV Alikhan** | Documentation and deployment setup   |

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute as needed.



