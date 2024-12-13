# CSCI2720 Project - 2024R1 Group 5

## Group Members
| Name                 | Student ID |
| -------------------- | ---------- |
| LEUNG Pui Ying       | 1155212116 |
| MO Sheung            | 1155212956 |
| TANG Yuk Yee         | 1155176025 |
| ZHUMAGALEYEV Alikhan | 1155184239 |

## Project Overview
This repository contains the project for the **CSCI2720** course, developed by **Group 5 (2024R1)**. The project aims to create a user-friendly web application for managing cultural programmes. It adheres to the course requirements and guidelines, demonstrating collaborative efforts and technical implementation.

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
This project focuses on solving the challenge of simplifying cultural event management for users and administrators. It provides functionalities such as map browsing, programme searching, and admin control, ensuring a seamless Single Page Application (SPA) experience.

## Features
- **Account Authentication**: Secure login and API access for users and admins.
- **Programme Management**: Search, browse, and filter cultural programme and venues dynamically.
- **Admin Panel**: Full CRUD operations for managing user accounts, programmes and venues.
- **Interactive Map**: Display venue locations on a map using the open-source Leaflet.js library.
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
- **Frontend**: Built using ES modules (Typescript) to leverage tree-shaking and smaller bundle sizes. This ensures compatibility with modern browsers and front-end frameworks like React.
- **Backend**: Utilizes CommonJS modules (Javascript) for maximum compatibility with Node.js and existing middleware packages.

To streamline development, the `concurrently` library is used to run both frontend and backend servers simultaneously, improving efficiency during iterative development.

### Steps for setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MiffyLeung/CSCI2720-Project.git
   ```

2. Navigate to the project directory: `cd Y:\\path\to\CSCI2720-Project`

3. Install dependencies in each folder:
   - **Root**:   `npm install`
   - **Backend**:     `cd backend`       `npm install`    `cd ..`
   - **Frontend**:     `cd frontend`      `npm install`    `cd ..`

4. **Edit** the config file inside `backend/.env` and `frontend/.env` to meet your enivorment.

5. Build data for the MongoDB
   - Create primary user accounts by `npm run create-accounts`
   - Setup programmes / venues data from the data source XML by `npm run create-data` 
   **(Optionally, you can update such data from Admin panel)**

6. Start the Frontend application by `npm run start-frontend`
   and Backend server by `npm run start-backend`
   Or, you can simply start up both by `npm start`

## Usage
Once the project is running:

1. Access the application:
   - **Frontend**: Open [http://localhost:3000](http://localhost:3000).
   - **Backend API**: The backend runs at [http://localhost:5000](http://localhost:5000).

2. Log in as a user or admin:
   - **User Login**: Access basic functionalities like browsing programmes, map view and some interactive action like bookmark / like / comment etc.
   - **Admin Login**: Access additional features, including CRUD operations of all the three kinds of data, Programmes / Venues / Accounts.

3. Explore features:
   - View Programmes(Venues) on an interactive map and edit the geolocation directly on the map.
   - Upload avatars and changing password for users and admin, it will store in the DB with binary data.
   - Filter, Sort and view detailed on the Programme information.
   - Import data from the most updated XML online to MangoDB.

4. Routes
| **Feature**              | **Frontend Route**         | **Backend API Route**                                      | **HTTP Method** |
|--------------------------|----------------------------|-----------------------------------------------------------|-----------------|
| Login                   | `/login`                  | `/api/login`                                              | `POST`          |
| Recent Programmes       | `/recent`                 | `/api/programmes?type=recent`                             | `GET`           |
| Hottest Programmes      | `/hotest`                 | `/api/programmes?type=hotest`                             | `GET`           |
| My Favourites           | `/myfavorites`            | `/api/myFavourite`                                        | `GET`           |
| My Profile              | `/myprofile`              | `/api/myAccount`                                          | `GET`           |
| Change Password         | `/myprofile (Ajax)`       | `/api/password`                                           | `GET`           |
| View Programme Details  | `/programme/:id`          | `/api/programmes/:id`                                     | `GET`           |
| Manage Programmes       | `/admin/programmes`       | `/api/programmes?search=STRING&orderby=FIELD`             | `GET`           |
| Add Programme           | `/admin/programmes (Ajax)`| `/api/programmes`                                         | `POST`          |
| Edit Programme          | `/admin/programmes/:id (Ajax)`| `/api/programmes/:id`                                   | `PATCH`         |
| Delete Programme        | `/admin/programmes/:id (Ajax)`| `/api/programmes/:id`                                   | `DELETE`        |
| Manage Venues           | `/admin/venues`           | `/api/venues?search=STRING&orderby=FIELD`                | `GET`           |
| Add Venue               | `/admin/venues (Ajax)`    | `/api/venues`                                            | `POST`          |
| Edit Venue              | `/admin/venues/:id (Ajax)`| `/api/venues/:id`                                        | `PATCH`         |
| Delete Venue            | `/admin/venues/:id (Ajax)`| `/api/venues/:id`                                        | `DELETE`        |
| Manage Accounts         | `/admin/accounts`         | `/api/accounts`                                          | `GET`           |
| View Account Details    | `/admin/account/:id`      | `/api/account/:id`                                       | `GET`           |
| Create Account          | `/admin/accounts (Ajax)`  | `/api/accounts`                                          | `POST`          |
| Edit Account            | `/admin/account/:id (Ajax)`| `/api/accounts/:id`                                      | `PATCH`         |
| Ban Account             | `/admin/account/:id (Ajax)`| `/api/accounts/:id/ban`                                  | `PATCH`         |
| Like a Programme        | `/programme/:id (Ajax)`   | `/api/programmes/:id/like`                               | `POST`          |
| Comment on Programme    | `/programme/:id (Ajax)`   | `/api/programmes/:id/comment`                            | `POST`          |


## Data Source
This project uses publicly available real-world data from the following dataset:
- **Dataset**: Cultural Programmes
- **Source**: [https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural](https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural)

The dataset contains information about cultural programs, including details like program titles, venues, dates, descriptions, and presenters.

## Technologies Used
- **Frontend**: `React`, `TypeScript`, `Axios`, `Webpack`
- **Backend**: `Node.js`, `Express`, `Mongoose`
- **Database**: `MongoDB`
- **Map API**: `Leaflet.js`
  - **Reason**: Leaflet is an open-source map library that does not require an API key or account registration, unlike `Google Maps` or `Mapbox`, which both require a credit card for their free-tier accounts.
- **Utilities**: `Concurrently`
  - Used to simultaneously run both the frontend and backend servers, simplifying development workflows.

## Development Strategy

### 1. Easy to Maintain and Reuse
* **Package Components**: Most visual components are replaced with React components, stored in `frontend/src/components/` for easy reuse and maintainability.
* **Centralize Field Metadata**: The structure and initial state of various data fields are centralized in `frontend/src/types/`.

### 2. Modular Page Design
* **Divide Complex Pages**: Overly complex pages are divided into smaller subdivisions to facilitate the use of AI for checking, debugging, and enhancing functions.

### 3. Strict Module Version Control
* **Select Module Versions Carefully**: Modules are carefully selected and versions strictly controlled to reduce conflicts and ensure compatibility.

## Contributors
This project was collaboratively developed by **Group 5 (2024R1)** for the **CSCI2720** course.

| **Name**                 | **Role/Responsibilities**               |
| ------------------------ | --------------------------------------- |
| **LEUNG Pui Ying**       | Full-stack support and deployment setup |
| **MO Sheung**            | Backend API and database integration    |
| **TANG Yuk Yee**         | Frontend development and UI design      |
| **ZHUMAGALEYEV Alikhan** | Documentation and testing               |

## License
This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute as needed.
