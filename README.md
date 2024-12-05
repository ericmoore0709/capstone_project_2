# Capstone Project Two

Deployment Link: https://capstone-project-2-d44v.onrender.com/

## **Description**
This project is my second capstone project for Springboard, showcasing my skills as a full-stack developer. It demonstrates proficiency in building robust, dynamic applications using modern technologies. The project is designed to allow users to digitize, organize, and share their recipes with like-minded foodies.

Key features include:
- Log in with Google.
- Create, edit, and delete recipes. 
- View public recipes submitted by all users.
- Create, edit, and delete shelves.
- Organize recipes by adding to/removing from shelves.
- Edit public profile
- See other users' public profiles

This project aims to highlight my ability to create scalable, maintainable solutions while delivering a user-friendly experience.

---

## **Installation**

### Prerequisites
- Node.js: 20.10.0
- Express: 4.21.1
- React: 18.3.1
- Vite: 5.4.10
- npm: 10.2.5
- postgres: 16.2
- psql: latest version

### Required environment variables (.env)
- backend
  - DATABASE_URL: the url of the postgres database (ie. `postgresql://myusername:mypassword@127.0.0.1:5432/mydatabase`
  - GOOGLE_CLIENT_ID: the Google Client ID provided when creating the workspace [here](https://console.cloud.google.com/) (see "Setting up Google Project" below).
  - GOOGLE_CLIENT_SECRET: the Google Client secret provided when creating the workspace (see above).
  - CLIENT_BASE_URL: the base URL of the client website (in local dev case, this is `http://localhost:5173`).
  - JWT_SECRET: a secret code phrase or password with which to sign the JWTs.
  - SESSION_SECRET: a password for marking and verifying the client session.
- frontend
  - VITE_BACKEND_URI: The URL of the backend server (in local dev case, this is `http://localhost:3000`).

### Setting up Google Project
Creating a google project is necessary to enable Google's authentication and erge the major features of the website.
1. Go to the [Google Developer Cloud] website (https://console.cloud.google.com/).
2. Create an account (if necessary)
3. Click the projects dropdown and select "NEW PROJECT".
4. Give the project a name and click "CREATE".
5. Ensure the new project is listed as the active project in the dropdown.
6. Click the "APIs and Services" button.
7. Click OAUTH CONSENT SCREEN on the left.
8. Select "External" under "User Type" and click "CREATE" button.
9. Give the app a name, a support email, and a "developer contact information" email.
10. Click "SAVE AND CONTINUE".
11. Click the "ADD OR REMOVE SCOPES" button.
12. Select the two checkboxes with "Scope" labels: ".../auth/userinfo.email" and ".../auth/userinfo.profile" and click the "UPDATE" button below.
13. Click "SAVE AND CONTINUE"
14. Ignore test users and click "SAVE AND CONTINUE"
15. Click on the "Credentials" tab on the left.
16. Click "+ CREATE CREDENTIALS" near the top and select "OAUTH Client ID".
17. Under "Application Type", select "Web Application".
18. Give the client a name (optional)
19. Under "Authorized JavaScript origins" click "ADD URI" and insert "http://localhost:3000" and (again to add) "http://localhost:5173"
20. Under "Authorized redirect URIs", click "ADD URI" and insert "http://localhost:3000/auth/google/callback".
21. Click the "CREATE" button below.
22. Take note of and log the Client ID and Client Secret (to be used as environment variables in the backend project). 
 
### Steps to Set Up
1. Clone this repository: `git clone https://github.com/hatchways-community/capstone-project-two-f8757d8df89c41e78fe40d395a6cc875`
2. Navigate to the backend directory: `cd recipes_backend`
3. Install dependencies: `npm install`
4. Create and seed database: `psql <-U user> <dbname> -f db.sql`
5. Start the development server: `npm run dev`
6. Navigate to the frontend directory: `cd ../recipes_frontend`
7. Install dependencies: `npm install`
8. Start the development client: `npm run dev`
9. Open your browser and navigate to `http://localhost:5173`

---

## **Features**
- **Feature 1**: User authentication via Google OAuth API and Passport (Google Strategy).
- **Feature 2**: Create, Read, Update, and Delete recipes.
- **Feature 3**: Create, Read, Update, and Delete shelves.
- **Feature 4**: Read and Update user profile.

---

## **Technologies Used**
This project utilizes the following technologies:
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Testing**: Jest, Supertest
- **Tools**: Git

---

## **Testing**
Testing has been implemented using Jest. Follow these steps to run the tests:

1. Install test dependencies: `npm install --dev`
2. Run the tests: `npm test`

Tests include:
- **Unit Tests**: Testing individual components and functions.
- **Integration Tests**: Verifying proper communication between modules.
- **End-to-End Tests**: Simulating user interaction with the application.

---

## **Known Issues/Limitations**
- **Authentication**: Authentication flow improperly handles token and session management.
- **Modularity**: Application not designed for long-term maintenance or high availability of DAU.
- **Incomplete**: Many intended features are currently under development and not included in this project description (except in Future Development below).
- **Faulty tests**: Many subfeatures are still untested and a few features are tested incorrectly, leading to many false positives.

---

## **Future Development**
- **Feature 1**: Ingredients and Directions to be included in recipes so other users can make the same meals themselves.
- **Feature 2**: Communities built amongst users of similar tastes, categories, and locations of recipes.
- **Feature 3**: Direct and Community instant messaging (using Socket.io).
- **Feature 4**: Ingredient shopping list generator and price calculator (using Zestful and Spoonacular APIs).

---
