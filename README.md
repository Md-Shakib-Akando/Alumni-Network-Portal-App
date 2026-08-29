# 🎓 Alumni Network Portal

<div align="center">

![Expo](https://img.shields.io/badge/Expo-51.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey?style=for-the-badge)

A full-featured, cross-platform mobile application that connects university **alumni**, **students**, and **staff** — fostering lifelong professional relationships through mentorship, networking, events, and career opportunities.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Screens & Navigation](#-screens--navigation)
- [Data Models](#-data-models)
- [Contributing](#-contributing)

---

## 🌟 Overview

The **Alumni Network Portal** is a comprehensive university networking platform built with **Expo 51** and **React Native**. It bridges the gap between graduates and current students by providing a rich set of tools for mentorship, career growth, real-time messaging, event management, and community engagement — all within a single mobile application.

**Key Highlights:**
- 12,500+ alumni connected across 8 regional chapters
- 320+ active mentors offering 1:1 guidance
- Real-time direct messaging with conversation management
- Role-based access control (Alumni / Student / Staff)
- Granular privacy controls with field-level visibility settings

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication & Onboarding** | Smooth onboarding flow with role-based login (Alumni, Student, Staff) |
| 🏠 **Home Dashboard** | Personalized feed with campus announcements, featured mentors, and upcoming events |
| 📁 **Alumni Directory** | Searchable, filterable directory of all network members by major, industry, and location |
| 💬 **Direct Messaging** | 1:1 real-time conversations with unread badge counts and request/active status |
| 🎓 **Mentorship Hub** | Browse and connect with senior alumni mentors; manage mentee relationships and sessions |
| 📅 **Events & Reunions** | RSVP to in-person, virtual, and hybrid campus events; waitlist management |
| 💼 **Job Board** | Alumni-posted job listings with referral requests; moderation pipeline for staff |
| 👥 **Alumni Chapters** | Department and regional interest groups with community posts, likes, and comments |
| 🔔 **Notification Center** | Categorized push notifications (messages, mentorship, events, jobs, system) |
| 🛡️ **Privacy Controls** | Field-level visibility settings (public / alumni-only / hidden) for profile data |
| 👤 **Profile Management** | Rich profiles with career history, education, skills, social links, and resume upload |

---

## 🛠 Tech Stack

**Core**
- [Expo](https://expo.dev/) `~51.0` — Managed workflow for cross-platform development
- [React Native](https://reactnative.dev/) `0.74.5` — Mobile UI framework
- [TypeScript](https://www.typescriptlang.org/) `~5.3` — Type-safe development

**Navigation**
- `@react-navigation/native` `^6.1` — Core navigation library
- `@react-navigation/native-stack` `^6.9` — Stack navigator
- `@react-navigation/bottom-tabs` `^6.5` — Tab bar navigator

**UI & Styling**
- `@expo/vector-icons` `^14.0` — Ionicons and more
- `expo-linear-gradient` `~13.0` — Gradient backgrounds
- `expo-font` `~12.0` — Custom font loading

**State & Storage**
- React Context API — Global application state (AppContext)
- `@react-native-async-storage/async-storage` `1.23.1` — Persistent local storage

**Platform Support**
- `react-native-safe-area-context` `4.10.5`
- `react-native-screens` `~3.31`
- `react-native-web` `~0.19` — Web compatibility via Metro

---

## 📁 Project Structure

```
alumni-network-portal/
├── App.tsx                     # App entry point, navigation container
├── app.json                    # Expo configuration
├── package.json
├── tsconfig.json
└── src/
    ├── api/
    │   ├── types.ts            # All TypeScript interfaces and type definitions
    │   └── mockData.ts         # Mock data for development/demo
    ├── components/
    │   └── common/             # Shared UI components (Header, Badge, etc.)
    ├── constants/
    │   └── theme.ts            # Colors, shadows, typography, university config
    ├── navigation/
    │   └── TabNavigator.tsx    # Bottom tab bar navigator
    ├── screens/
    │   ├── auth/               # LoginScreen, OnboardingScreen
    │   ├── home/               # HomeScreen (dashboard)
    │   ├── directory/          # Alumni directory & search
    │   ├── messages/           # Conversations list & chat screen
    │   ├── mentorship/         # Mentorship hub, mentor/mentee views
    │   ├── events/             # Events list & event detail
    │   ├── jobs/               # Job board & referral requests
    │   ├── notifications/      # Notification center
    │   └── profile/            # My profile & profile detail view
    └── store/
        └── AppContext.tsx      # Global state management (React Context)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your iOS or Android device (for physical device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/alumni-network-portal.git
   cd alumni-network-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open on your device**
   - Scan the QR code with the **Expo Go** app (Android) or the **Camera** app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator, `w` for web browser

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run android` | Start and open on an Android device/emulator |
| `npm run ios` | Start and open on an iOS simulator |
| `npm run web` | Start and open in the web browser |
| `npm run ts:check` | Run TypeScript type checking without emitting files |

---

## 🗺 Screens & Navigation

The app uses a **Stack + Bottom Tab** navigation pattern:

```
RootNavigator (Stack)
├── OnboardingScreen
├── LoginScreen
└── MainApp
    └── TabNavigator (Bottom Tabs)
        ├── 🏠  Home          → HomeScreen
        ├── 👥  Directory     → DirectoryScreen
        ├── 💬  Connect       → ConversationsListScreen
        ├── 🎓  Mentorship    → MentorshipHubScreen
        ├── 📅  Events        → EventsListScreen
        └── 👤  Me            → MyProfileScreen

    Modal / Stack Screens (pushed from tabs):
        ├── ProfileDetailScreen
        ├── EventDetailScreen
        ├── ChatScreen
        ├── JobDetailScreen
        ├── GroupsScreen
        ├── NotificationCenterScreen
        └── PrivacySettingsScreen
```

---

## 🗃 Data Models

All TypeScript interfaces are defined in `src/api/types.ts`. Key models include:

| Model | Description |
|---|---|
| `UserProfile` | Core user model with role, education, career, mentorship, and privacy fields |
| `UserRole` | `'alumni' \| 'student' \| 'staff'` |
| `FieldVisibility` | Per-field privacy settings (`'public' \| 'alumni-only' \| 'hidden'`) |
| `CareerExperience` | Work history entry with company, title, dates |
| `EventItem` | Campus event with RSVP, capacity, and virtual link support |
| `JobListing` | Job posting with moderation status and alumni referral count |
| `MentorshipRequest` | Mentor/mentee pairing with goal, message, and status lifecycle |
| `Conversation` | DM thread with participant, last message, and unread count |
| `InterestGroup` | Alumni chapter/club with posts, members, and category |
| `AppNotification` | In-app notification across 5 categories |
| `ReferralRequest` | Job referral request with status tracking |
| `ModerationReport` | Content moderation report submitted by users |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code passes TypeScript checks before submitting:
```bash
npm run ts:check
```

---

## 📄 License

This project is private and proprietary to the institution.
© 2026 Alumni Network Portal. All rights reserved.

---

<div align="center">
  Built with ❤️ using <a href="https://expo.dev">Expo</a> & <a href="https://reactnative.dev">React Native</a>
</div>
