## Prerequisites

- Node.js installed
- MySQL installed and running
- Python installed if you want to enable the local `pre-commit` hook

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Make sure your MySQL server is running.
   - Create a database named `bookStore`.
   - Import the `database_setup.sql` file into the database.

3. **Run the app**
   ```bash
   npm run start
   ```

4. Open your browser and navigate to:
   - `http://localhost:5000`

## CI/CD Pipeline

GitHub Actions runs two stages on every push, pull request, and manual dispatch:

- **Testing Stage**: installs dependencies, runs unit tests, then runs integration tests.
- **Security Scan Stage**: runs GitLeaks against the repository history after the tests pass.

## Local GitLeaks Pre-Commit Hook

To run GitLeaks before every commit:

1. Install `pre-commit`.
   ```bash
   pip install pre-commit
   ```
2. Install the repo hooks.
   ```bash
   pre-commit install
   ```
3. GitLeaks will now run automatically before each commit.

