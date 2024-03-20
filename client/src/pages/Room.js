import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { SocketContext, UserContext, QuizContext} from '../App';
import { useNavigate } from 'react-router-dom';
import apiUrl from "../api-config";
import { NavLink } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [players, setPlayers] = useState([])
  const socket = useContext(SocketContext)
  const {user} = useContext(UserContext)
  const {currentQuestion, setCurrentQuestion} = useContext(QuizContext)
  const [clientURL, setClientURL] = useState("http://localhost:3000")

  const startQuiz = (quizId) => {
    socket.emit('start_quiz', {quizId: Number(quizId)})
    console.log("start the quiz")
  };



  // this hook is for fetching quiz information
  useEffect(() => {
    if (apiUrl === "http://104.197.136.104:3500"){
      setClientURL("http://104.197.136.104")
    }
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`${apiUrl}/quizzes/${id}`);
        const data = await response.json();
        console.log("quizdata = ", data)
        setQuiz(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizData();
  }, [id])


  useEffect(() => {
    if (socket && quiz){
      const user_email = user? user.email : "Anonymous"

      socket.emit("join_room", { quizId: Number(id), email: user_email, quiz:quiz })
      

    }
  
  }, [socket, id, user, quiz]);




  useEffect(() => {
    if (socket) {
      console.log("socketID: ", socket.id)  
      const handleDisplayPlayer = (data) => {
        console.log("display player:", data);
        setPlayers(data)
      };

      const handleRoomDeleted = (data) => {
        console.log("this room is deleted")
        navigate(`/`)
      }
      
      const handleNextQuestion = (data) => {
        console.log("next quesion arrived in Room.js:", data)
        // send player to main quiz 
        setCurrentQuestion(data)
        navigate(`/quiz/${id}`)
        

      };

      socket.on("display_new_player", handleDisplayPlayer);
 
      socket.on("room_deleted", handleRoomDeleted);

      socket.on("next_question", handleNextQuestion);

      return () => {
        socket.off("display_new_player", handleDisplayPlayer);
        socket.off('room_deleted', handleRoomDeleted);
        socket.off('next_question', handleNextQuestion);
      };
    }
  }, [socket, id]);


  return (
    user === null ? (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1>Join a quiz</h1>
        <NavLink activeclassname="active" className="nav-link" to="/Register">
          <button className="btn btn-primary mt-2">
            Please login or create an account before taking the quiz
          </button>
        </NavLink>
    </div>
    ): (
      <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <h3> {"Quiz id:" + quiz?.quizid + " - " + " question: " + quiz?.tname}</h3>
          <QRCode value={`${clientURL}/Room/${id}`} size={256*2} />
          {quiz?.uid === user?.uid ? (
            <button onClick={() => startQuiz(id)} className="btn btn-success btn-block mb-4">
            Start the quiz
          </button>
          ) : (<>
            <p>wait for host to start the quiz</p>
          </>)}
          
        </div>

        <div className="col-lg-6 col-md-12">
          <h3>Wait for player to join...</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{"user: " + player.email + " - socket id: " + player.connect_id}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    )
  );
}

export default Room;