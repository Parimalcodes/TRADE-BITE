# Email Service

This project is an email service that allows sending emails using a specified mail service. It is structured to separate concerns into controllers, services, and routes for better maintainability.

## Project Structure

```
email-service
├── src
│   ├── index.js              # Entry point of the application
│   ├── controllers           # Contains the mail controller
│   │   └── mailController.js # Handles email sending logic
│   ├── services              # Contains the mail service
│   │   └── mailService.js    # Configures and sends emails
│   ├── config                # Configuration settings
│   │   └── index.js          # Loads environment variables
│   └── routes                # Defines application routes
│       └── mailRoutes.js     # Sets up email-related routes
├── .env                       # Environment variables
├── package.json              # NPM configuration file
├── .gitignore                # Files to ignore by Git
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd email-service
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following content:

```
EMAIL_USER=tradebite.12@gmail.com
EMAIL_PASS=btmt pcxh fuoa cman
PORT=3000
```

## Usage

To start the application, run:

```
npm start
```

The application will listen on the port specified in the `.env` file. 

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.