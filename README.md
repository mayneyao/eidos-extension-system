# Eidos Extension System

The Eidos Extension System is a solution for implementing extensions in web applications. Please note that this project is currently a proof-of-concept (POC) and should not be used in production.

## How it Works

TODO:

## What Can It Do
This project is a part of the Eidos Extension System and comes with an unexpected feature - the ability to deploy a static web app within a web app. Instead of using separate programs like `npx serve`, `python -m http.server`, or Docker to deploy your static web app locally, you can simply drop the output from the dist folder into this Progressive Web Application (PWA) and start it with a single click.

Clone the repository by running the following command in your terminal:
```bash
git clone https://github.com/mayneyao/eidos-extension-system.git
```

Open [the Eidos Extension System Demo](https://eidos-extension-system.vercel.app/) in your web browser.

Locate the sqlite3-fiddle directory within the cloned repository and drag it onto the web page.
This will automatically deploy the sqlite3-fiddle static web app within the Eidos Extension System Demo.