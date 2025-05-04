![DecentraLearn](https://i.imgur.com/sNKjf6h.png)  

# DecentraLearn 📚

DecentraLearn is a decentralized e-learning platform built on the Internet Computer Protocol (ICP) that empowers users to create, enroll, and progress through structured courses powered by Web3 technology. It integrates smart contracts (Rust canisters), Internet Identity authentication, Llama 3.1 LLM canister, and a modern frontend built with React and TailwindCSS.

## Demo Video 🎥

[Watch here!](https://youtu.be/ZLrLtmprAMs)

## Key Features ✨

* **Internet Identity Authentication:** Secure and seamless login using ICP's native authentication system.
* **Course Creation (Admin):** Admins can create courses with metadata such as title, description, image, and category.
* **Modular Content Management:** Courses are structured into modules and lessons, enabling an intuitive and organized learning flow.
* **Decentralized Progress Tracking:** Student progress is securely tracked and stored on-chain, ensuring transparency and reliability.
* **Modern Frontend with TailwindCSS:** A responsive and user-friendly interface built using React, TailwindCSS, and ShadCN UI components.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `DecentraLearn`, see the following documentation available online:

* [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
* [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
* [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
* [ic-cdk](https://docs.rs/ic-cdk)
* [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
* [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd DecentraLearn/
dfx help
dfx canister --help
```

## Running the Project Locally 🖥️

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

If you want to test the AI functionality, you can use the following command:

```bash
# Start Ollama Server
ollama serve

# Download the model if you haven't already
ollama pull llama3.1:8b
```

You can then do `dfx deploy` in another terminal to deploy the canisters and start the server.

## Tech Stack 🛠️

* **Frontend:** React, TypeScript, TailwindCSS, ShadCN/UI  
* **Auth:** Internet Identity (ICP native)  
* **AI Integration:** Ollama (Llama 3.1) on LLM Canister
* **Backend:** Rust, ic-cdk, Internet Computer Canisters  
* **Dev Tools:** DFX, Vite, Recharts, Class Variance Authority  

## User Roles 👥

### 👥 Guest Users

* Browse courses
* View course details
* Limited UI interactions (no progress tracked)

### 👨‍🎓 Students (Logged In)

* Enroll in courses
* Track module/lesson progress
* Resume learning across sessions

### 👨‍💼 Admins

* Create/edit/delete courses
* Add modules and lessons
* View user progress analytics (charts, visualizations)

## Landing Page 🌐

| **Screen**         | **Description**                                                                 | **Preview**                                                                 |
|---------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Landing Page**    | The initial page where users can explore courses or log in via Internet Identity. | ![Landing Page](https://i.imgur.com/sNKjf6h.png)                           |
| **Auth Page**       | The login page that redirects users to Internet Identity authentication.        | ![Auth Page](https://i.imgur.com/3FVsHv4.png)                              |
| **Explore Page**    | Displays all available courses for users to browse and explore.                 | ![Explore Page](https://i.imgur.com/qaS5Fwu.png)                           |
| **Course Page**     | Displays detailed information about a specific course, including modules and lessons. | ![Course Page](https://i.imgur.com/xvRdymE.png)                            |
| **Lesson Page**     | Displays the content of a specific lesson within a module.                      | ![Lesson Page](https://i.imgur.com/9QP9fPd.png)                            |

## Admin Page 🛠️

| **Screen**                | **Description**                                                                 | **Preview**                                                                 |
|----------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Dashboard Screen**       | Displays an overview of courses, modules, and student progress analytics.       | ![Dashboard Screen](https://i.imgur.com/kVBaIMG.png)                       |
| **Create Courses Screen**  | Allows admins to create new courses by adding metadata like title, description, and category. | ![Create Courses Screen](https://i.imgur.com/2ybVoRy.png)                  |
| **Admin Users Page**       | Displays a list of users with their roles and permissions.                      | ![Admin Users Page](https://i.imgur.com/82WgTL7.png)                       |
| **Admin Courses Page**     | Displays a list of courses with options to edit or delete them.                 | ![Admin Courses Page](https://i.imgur.com/D5RPieC.png)                     |
| **Admin Modules/Lessons Page** | Displays modules and lessons within a course, with options to manage them.      | ![Admin Modules/Lessons Page](https://i.imgur.com/23wlhk7.png)             |

## AI Functionality 🤖

The AI functionality is integrated using the Ollama LLM Canister. It uses the Llama 3.1 model to answer questions and provide helpful responses. The AI exists in chatbot form, where users can ask questions on a variety of topics. Below is a picture of the AI functionality in action:

| Input | Screenshot Output |
|-------|------------------|
| Hello | ![picture 6](https://i.imgur.com/KhD2dfn.png) |
| Tell me a joke | ![picture 9](https://i.imgur.com/SFUL9wg.png) |
| I like apple | ![picture 10](https://i.imgur.com/xdilguM.png) |

## Backend Functionality ⚙️

The backend is built using Rust and the Internet Computer SDK. It provides the following functionalities:

### Course Management 📋

| **Function**                          | **Description**                                                                 |
|---------------------------------------|---------------------------------------------------------------------------------|
| `add_course(course: CourseInput): nat32` | Adds a new course and returns the course ID.                                    |
| `edit_course(course_id: nat32, course: CourseInput): bool` | Edits an existing course and returns a success status.                         |
| `get_course(course_id: nat32): Course` | Retrieves details of a specific course by its ID.                              |
| `get_courses(): CourseEntry[]`        | Retrieves a list of all available courses.                                     |

### Module & Lesson Management 🗂️

| **Function**                          | **Description**                                                                 |
|---------------------------------------|---------------------------------------------------------------------------------|
| `add_module(course_id: nat32, ...): nat32` | Adds a new module to a course and returns the module ID.                        |
| `get_course_modules(course_id: nat32): Module[]` | Retrieves all modules associated with a specific course.                      |
| `add_lesson(module_id: nat32, ...): nat32` | Adds a new lesson to a module and returns the lesson ID.                       |
| `get_lessons_by_module(module_id: nat32): Lesson[]` | Retrieves all lessons associated with a specific module.                      |
