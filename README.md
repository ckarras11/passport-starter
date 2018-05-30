# Passport Starter

## Passport Boilerplate Code (Local Strategy)

Includes register and login page, with a home page and page that requires user to be authenticated.  Uses mongodb to store users in a User collection with hashed and salted passwords.  Also has some other middleware that can be removed based on project requirements.  Uses Mongoose and Express

### Middleware
1. BcryptJS
2. Body-Parser
3. Cookie-Parser
4. Express-Session
5. Express-Validator
6. Morgan
7. Connect-Flash

## Future Ideas

I want to add OAuth as well for google at the very least

## Installation

To install clone the repo, then `npm install` 

Make sure you have an instance of MongoDB running locally with the command `mongod` or `server.js` will error out

I personally use `nodemon server.js` but `node server.js` will work as well

Open `http://localhost:8080`

There are 3 endpoints

1. `/login`
2. `/register`
3. `/auth` PROTECTED

You can not get to the `/auth` endpoint without being authenticated it will redirect you to the login screen
