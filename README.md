# TRADE BITE Website

Website for TRADE BITE with contact form functionality using Node.js and Nodemailer.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Settings

Create a `.env` file in the root directory with the following content:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
PORT=3000
```

**Important: Setting up Gmail App Password**

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** > **2-Step Verification** (enable it if not already enabled)
3. Go to **App passwords** (you may need to search for it)
4. Select **Mail** as the app and **Other (Custom name)** as the device
5. Enter "TRADE BITE" as the custom name
6. Click **Generate**
7. Copy the 16-character password and paste it in the `EMAIL_PASS` field in your `.env` file

**Note:** Use the Gmail account that you want to send emails from. The emails will be sent to `tradebite.12@gmail.com` as configured in the server.

### 3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Access the Website

Open your browser and navigate to:
- Home: `http://localhost:3000/`
- Contact: `http://localhost:3000/contact.html`

## Features

- Contact form with validation
- Email notifications sent to tradebite.12@gmail.com
- Form data includes:
  - Full Name
  - Email
  - Country
  - Country Code
  - Mobile Number
  - Company Name
  - Message

## Project Structure

```
Yashvi 2.0/
├── server.js          # Express server with Nodemailer
├── package.json       # Dependencies
├── .env              # Email configuration (create this)
├── .gitignore        # Git ignore file
├── index.html        # Home page
├── about.html        # About page
├── products.html     # Products page
├── certificates.html # Certificates page
├── contact.html      # Contact page
├── style.css         # Styles
├── main.js           # Client-side JavaScript
└── assets/           # Images and other assets
```

## Troubleshooting

### Email not sending?

1. Make sure you're using an **App Password** (not your regular Gmail password)
2. Verify that 2-Step Verification is enabled on your Google Account
3. Check that the `.env` file exists and has the correct values
4. Check the server console for error messages

### Server won't start?

1. Make sure all dependencies are installed: `npm install`
2. Check that port 3000 is not already in use
3. Verify that Node.js is installed: `node --version`

## License

ISC

