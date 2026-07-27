# UniLEARN

A React Native Student Learning Management System (LMS) mobile application built for **NSBM Green University**.


## Features

- **User Authentication** — Secure login with JWT token persistence via AsyncStorage
- **Dashboard** — Overview of courses, upcoming exams, and pending assignments
- **Courses** — Browse enrolled courses with search and progress tracking
- **Assignments** — View, filter, and submit assignments
- **Exam Schedule** — Full examination timetable with filters and next-exam highlights
- **Profile** — Student account information and settings
- **REST API Integration** — Structured API layer ready for NSBM backend (mock data included)
- **Responsive Layouts** — Adapts to different screen sizes using custom hooks

## Theme

NSBM-inspired color palette:
- Primary Green: `#006B3F`
- Dark Green: `#004D2E`
- Accent Gold: `#FFB300`
- White & light gray backgrounds


### Demo Login

Use any university email and a password with 4+ characters:

```
Email:    student@students.nsbm.ac.lk
Password: demo
```



## Connecting to Real API

Edit `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.nsbm.lk/unilearn/v1',
  USE_MOCK: false,  // Set to false for production
  TIMEOUT: 15000,
};
```

## Screens

| Screen | Description |
|--------|-------------|
| Login | NSBM-branded authentication |
| Dashboard | Home with stats, exams, courses |
| Courses | Searchable course list |
| Course Detail | Individual course info |
| Assignments | Filterable assignment tracker |
| Exam Schedule | Full exam timetable |
| Profile | Account & logout |

## Tech Stack

- React Native (Expo SDK 57)
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- React Hooks & Context API
- AsyncStorage
- Expo Linear Gradient

## License

Built for NSBM Green University — educational use.
