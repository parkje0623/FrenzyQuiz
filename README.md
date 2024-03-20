# Frenzy Quiz (Team Project)
Frenzy Quiz is a real-time interactive quiz platform enabling all users to formulate and manage various question formats.
All registered users may create and host a quiz and other users can engage with these quizzes by scanning QR codes or entering a quiz ID and completing the questions.
- (Currently do not have live server - due to expensive Goole API pricing)

## Participation
Frenzy Quiz project began with an extension of the existing learning platform 'Kahoot!' to create a real-time quiz platform for the teacher (host) and students (player).
I have mainly participated in the following tasks:
- Displaying the user's own created quiz list as a host
- Displaying the user's taken quiz list as a player
- Opening a room (socket) as a host and allowing other players to join the room
- Processing the quiz: displaying quiz questions, setting the timer for each question, displaying the correct answer after the timer, proceeding to the next question, and presenting a leaderboard at the end of the quiz.
- Managing PostgreSQL database: creating tables and relationships, queries to fetch data, and reviewing the other member's queries

## Technologies
Following technologies have been used to create the web application:
- Design/Function: **React JS**
- HTTP Request: **Node.js**
- Database: **PostgreSQL**

## API
Following APIs are used to implement required features:
- Deployment: **Google Cloud Platform (Cloud Service)**
- Authentication: **Firebase Authentication and Authorization**
- Real-time Communication: **Socket.io**

## Deployment
The deployment is uploaded on Google Cloud Platform, Cloud Service for both client and server-side code.
For testing purposes:
1. Open two separate terminal
2. To run client-side: cd client -> npm start
3. To run server-side: cd server -> npm run dev
