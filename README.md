---
title: '`DecentraLearn`'

---

# `DecentraLearn`

DecentraLearn is a decentralized e-learning platform built on the Internet Computer Protocol (ICP) that empowers users to create, enroll, and progress through structured courses powered by Web3 technology. It integrates smart contracts (Rust canisters), Internet Identity authentication, and a modern React-based frontend.

Key Features

* Internet Identity AuthenticationSecure and seamless login using ICP's native authentication.
* Course Creation (Admin)Admins can create courses with metadata (title, description, image, category).
* Modular Content ManagementCourses are structured into modules and lessons for easy learning flow.
* Decentralized Progress TrackingStudent progress is tracked and stored securely on-chain.
* Modern Frontend with Tailwind & ShadCNClean, responsive interface built using React, TailwindCSS, and ShadCN UI components.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `DecentraLearn`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd DecentraLearn/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Download the frontend dependencies
npm install

# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

## Tech Stack

* Frontend: React, TypeScript, TailwindCSS, ShadCN/UI
* Auth: Internet Identity (ICP native)
* Backend: Rust, ic-cdk, Internet Computer Canisters
* Dev Tools: DFX, Vite, Recharts, Class Variance Authority

## User Roles

👥 Guest Users

* Browse courses
* View course details
* Limited UI interactions (no progress tracked)

👨‍🎓 Students (Logged In)

* Enroll in courses
* Track module/lesson progress
* Resume learning across sessions

👨‍💼 Admins

* Create/edit/delete courses
* Add modules and lessons
* View user progress analytics (charts, visualizations)

## Landing Page

When first visiting the site, the user has an option to explore and login

![Landing Page](https://i.imgur.com/W9L3J2N.png)  

## Admin Page

As an admin we have the option to view the courses, modules and students. Admin also has the control to create new courses.

Dashboard Screen
![picture 1](https://i.imgur.com/kVBaIMG.png)  

Create Courses Screen
![picture 2](https://i.imgur.com/2ybVoRy.png)  

## User Interface



Backend Interface (IC Canister)

Course Management
- add_course(course: CourseInput): nat32
- edit_course(course_id: nat32, course: CourseInput): bool
- get_course(course_id: nat32): Course
- get_courses(): CourseEntry[]

Module & Lesson Management
- add_module(course_id: nat32, ...): nat32
- get_course_modules(course_id: nat32): Module[]
- add_lesson(module_id: nat32, ...): nat32
- get_lessons_by_module(module_id: nat32): Lesson[]