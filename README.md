# Polling Application

This project is a basic polling application built using Next.js, Tailwind CSS, and Prisma with SQLite. It allows users to create polls, vote on options, and view poll results. The application uses NextAuth for authentication to ensure that only logged-in users can create polls and vote.

## Features

- **User Authentication**: Users can sign up, log in, and log out using NextAuth.
- **Create Polls**: Authenticated users can create new polls with a title and multiple options.
- **Vote on Polls**: Users can vote for one option in a poll, and each user can only vote once per poll.
- **View Poll Results**: Users can view the results of polls, displaying the number of votes each option received.
- **Real-time Updates**: Poll lists and results are updated in real-time without needing a page refresh.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and building static web applications.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Prisma**: An ORM for interacting with the SQLite database.
- **SQLite**: A lightweight, disk-based database used for data storage.
- **NextAuth**: A library for handling authentication in Next.js applications.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/prodev08/polling-app.git
    cd polling-app
    ```

2. **Install dependencies**:

    ```sh
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root of the project and add the following environment variables:

    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret-key"
    ```

4. **Run database migrations**:

    ```sh
    npx prisma migrate dev --name init
    ```

5. **Start the development server**:

    ```sh
    npm run dev
    # or
    yarn dev
    ```

    The application will be available at `http://localhost:3000`.

## Usage

### Authentication

- **Sign Up**: Create a new account by providing a username, email, and password.
- **Log In**: Access your account by entering your email and password.
- **Log Out**: Log out of your account by clicking the "Sign Out" button.

### Polls

- **Create Poll**: Navigate to the "Create Poll" page, enter a title and at least two options, then submit the form to create a new poll.
- **Vote on Polls**: Select an option from the list of polls and click "Vote". You will see a success message after voting.
- **View Poll Results**: Click the "View Results" button to see the number of votes each option received.

## Project Structure

- `pages/`: Contains all the Next.js pages.
  - `api/`: API routes for handling poll creation, voting, and fetching poll results.
  - `auth/`: Authentication pages including sign in and sign up.
  - `index.js`: The main page displaying the list of polls.
  - `create.js`: The page for creating new polls.
- `prisma/`: Contains the Prisma schema and migration files.
- `styles/`: Contains global styles and Tailwind CSS configurations.

## API Routes

- `GET /api/polls`: Fetch all polls.
- `POST /api/polls`: Create a new poll.
- `POST /api/vote`: Vote on a poll.
- `GET /api/results?pollId=<pollId>`: Fetch poll results for a specific poll.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Special thanks to the developers of Next.js, Tailwind CSS, Prisma, SQLite, and NextAuth for their amazing tools and libraries.

---

Feel free to modify this README to better fit your project's details and requirements.
