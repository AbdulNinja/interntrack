# interntrack

A web app for tracking internship and job applications in one place. Log each application, update its status as it moves through the hiring process, and see deadlines and interviews at a glance.

**Live demo:** <https://interntrack-o4r2.vercel.app>

**Repository:** [https://github.com/AbdulNinja/interntrack]

**figma link:**[https://www.figma.com/proto/qxGa5ZIYM8UIF5u5YtjlfO/Untitled?node-id=3-291&t=YYawVq24V0vyiiFe-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A291]

## Features

- Email and password authentication (register, log in, log out)
- Protected pages: only logged-in users can see their data
- Add, edit and delete applications (full CRUD)
- Update an application's status directly from its card
- Interview date, time and details when an application reaches the Interview stage
- Deadline reminders: "Due today", "Due in 3 days", "Overdue by 2 days"
- Dashboard with a count for each status
- Search by company or job title, plus filters by status and job type
- Real-time updates: changes appear instantly without refreshing
- Responsive layout for phone, tablet and desktop

## Tech Stack

| Area | Tool |
|---|---|
| Front end | React 18, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Auth and database | Firebase Authentication, Cloud Firestore |
| Testing | Vitest, React Testing Library |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A free Firebase project

### 1. Clone and install

```bash
git clone [https://github.com/AbdulNinja/interntrack]
cd interntrack
npm install
```

### 2. Set up Firebase

1. Go to the [Firebase console](https://console.firebase.google.com) and create a project.
2. Add a **Web app** and copy its config values.
3. Open **Authentication > Sign-in method** and enable **Email/Password**.
4. Open **Firestore Database** and create a database.
5. Open the **Rules** tab, paste the contents of `firestore.rules` from this repo, and publish.

### 3. Add environment variables

Create a file named `.env` in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

`.env` is listed in `.gitignore`, so your keys are not committed. A template is provided in `.env.example`.

### 4. Run the app

```bash
npm run dev
```

Open the address printed in the terminal (usually http://localhost:5173).

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs all tests once |
| `npm run test:watch` | Re-runs tests when files change |
| `npm run coverage` | Runs tests and prints a coverage report |

## Project Structure

```
src/
  components/     Reusable UI pieces (Navbar, Modal, ApplicationCard, ApplicationForm, ...)
  context/        AuthContext: shares the logged-in user across the app
  hooks/          useApplications: live-loads the user's applications
  pages/          Login, Register, Dashboard, Applications
  services/       applications.js: all Firestore reads and writes
  utils/          constants, date helpers, search and filter logic
  test/           Test setup file
  firebase.js     Firebase initialisation
  App.jsx         Route definitions
  main.jsx        App entry point
```

Test files sit next to the file they test, for example `Modal.jsx` and `Modal.test.jsx`.

## Data Model

Each user's applications are stored at `users/{userId}/applications/{applicationId}`.

| Field | Description |
|---|---|
| `company`, `position` | Required |
| `status` | Saved, Applied, Interview, Offer, Rejected |
| `type` | Internship, Full-time, Part-time, Contract |
| `location`, `jobLink`, `notes` | Optional |
| `dateApplied`, `deadline` | Stored as `YYYY-MM-DD` text to avoid timezone bugs |
| `interviewDate`, `interviewTime`, `interviewDetails` | Used when status is Interview |
| `createdAt`, `updatedAt` | Server timestamps |

## Security

Firestore rules in `firestore.rules` make sure that:

- Only signed-in users can read or write data.
- A user can only access their own documents.
- Company, job title and status must be valid before a document is saved.

## Testing

The test suite uses Vitest and React Testing Library. Firebase is replaced with mocks, so the tests run without a network connection or a real account.

```bash
npm test
npm run coverage
```

Current coverage is about 69% of statements. Pages that talk directly to Firestore (`Dashboard`, `Applications`), `services/applications.js` and `firebase.js` are not covered. Testing them properly would need the Firebase Emulator.

## Deployment

The app is deployed on Vercel.

1. Push the repository to GitHub and import it in Vercel.
2. Add the same `VITE_FIREBASE_*` variables under **Project Settings > Environment Variables**.
3. In the Firebase console, open **Authentication > Settings > Authorized domains** and add your Vercel domain.
4. `vercel.json` rewrites all routes to `index.html` so page refreshes work.

## Git Workflow

Work was done on separate feature branches and merged into `main`:

- `auth-setup`: project setup, Firebase, authentication
- `application-crud`: add, edit, delete and status updates
- `deploy`: search, filters, tests, deployment
- `tests`: test suite

Commit messages and Tasks were tracked on a GitHub Projects Kanban board.


## Author

[Abdullahi Siyad Ahmed  (https://github.com/AbdulNinja)]