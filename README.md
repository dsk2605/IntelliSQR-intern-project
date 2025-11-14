# IntelliSQR Full Stack Internship Project

 This is my submission for the full-stack internship. It's a complete Todo application built from scratch with a React (TypeScript) frontend and a Node.js (TypeScript) backend, as requested in the assignment.

The app allows users to sign up, log in, and manage their own private to-do list.

## Features

I have included all the required features from the PDF, plus some extra "bonus" features to make the app feel more professional and modern.

### Core Features
* **Full User Authentication:** Users can sign up, log in, and log out.
* **Forgot/Reset Password:** A full, secure password reset flow (using a mock email).
* **Protected Routes:** You can't see the todo list unless you're logged in.
* **Create Todos:** Add new tasks using a clean popup modal.
* **List Todos:** See all your personal todos.
* **Update Todos:** Mark tasks as "Complete" or "Undo."
* **Delete Todos:** Remove tasks from the list.
* **Backend Error Logging:** All server errors are automatically saved to a special `logs` collection in MongoDB.
* **Edit-in-Place:** You can click "Edit" on any todo to change its text right in the list.
* **Live Filtering:** Instantly filter the list to see "All," "Active," or "Completed" tasks.
* **Toast Notifications:** The app gives you feedback for everything (like "Todo added!" or "Invalid password") using popups.
* **Modern UI/Theme:** A unique, professional dark-mode theme, including a split-screen auth page to give the app a strong identity.
* **Animations:** The modal and todo items fade and slide in/out smoothly.
* **Instant UI (Optimistic Updates):** When you add or delete a todo, the UI updates *instantly* (it doesn't wait for the server), which makes the app feel incredibly fast.

## Tech Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB Atlas
* **Authentication:** JWT (JSON Web Tokens) & `bcryptjs`
* **Validation:** Zod

### Frontend
* **Library:** React
* **Language:** TypeScript
* **Bundler:** Vite
* **Routing:** React Router
* **Global State:** Zustand (for managing the user's login state)
* **Data Fetching:** React Query (for all API data)
* **Form Handling:** React Hook Form
* **Validation:** Zod (works with React Hook Form)
* **UI:** CSS Modules
* **Animations:** Framer Motion
* **Notifications:** React Hot Toast


## Assumptions I Made

The PDF said I could make assumptions if I mentioned them. I made one:

* **Mock Email for Password Reset:** For the "Forgot Password" feature, I have built the entire secure backend logic (creating the unique token, hashing it, and setting an expiration time). To avoid the complexity of setting up a separate email server (like SendGrid), the app "mocks" sending an email.
* **How to test it:** When you ask for a password reset, just **check your backend terminal**. The server will print the unique reset link. You can copy and paste this link into your browser to test the full flow. This proves the logic works perfectly.
