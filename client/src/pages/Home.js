import React, { useEffect, useState, useContext } from 'react';
import { SocketContext, UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const [currentRoom, setCurrentRoom] = useState(null)
  const socket = useContext(SocketContext)
  const {user} = useContext(UserContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && user) {
      socket.emit('find_current_room', { email: user.email });
      socket.on('current_room_found', (roomData) => {
        console.log("current room data:", roomData)
        setCurrentRoom(roomData)
      })
      
      socket.on("room_deleted", (data) => {
        console.log("this room is deleted")
        setCurrentRoom(null)
      });

      return () => {
        socket.off('current_room_found')
        socket.off('room_deleted')
      }
    }
  }, [socket, user])

  const Rejoin = () => {
    navigate(`/Room/${currentRoom.quiz.quizid}`)
  }

  const deleteRoom = () => {
    socket.emit('delete_room', { email: user.email, quizId: currentRoom.quiz.quizid })
    setCurrentRoom(null)
  }

  const leaveRoom = () => {
    socket.emit('leave_room', { email: user.email, quizId: currentRoom.quiz.quizid })
    setCurrentRoom(null)
  }

  return (
    <div className="container w-75 d-flex flex-column align-items-center justify-content-center mt-4">

      {currentRoom && currentRoom.status === "waiting" ? (
        <>
          <h3>Current quizz</h3>
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">{currentRoom.quiz.tname}</h5>
              <small className="mb-1">id: {currentRoom.quiz.quizid} </small> <br></br>
              <small>Date:  {new Date(currentRoom.quiz.created).toISOString().split('T')[0]}</small>
              <div className='d-flex'>
                <button type="button" name="edit" className="btn btn-success btn-sm mt-2" onClick={() => Rejoin()}>Rejoin</button>
                {currentRoom.quiz.uid === user.uid ? (
                  <button type="button" name="start" className="btn btn-danger btn-sm mt-2 ml-2" onClick={() => deleteRoom()}>Delete room</button>
                ): (
                    <button type = "button" name = "start" className = "btn btn-danger btn-sm mt-2 ml-2" onClick={() => leaveRoom()}>Leave</button>

                  )}
              </div>
            </div>
          </div>
        </>
      ) : currentRoom && currentRoom.status === "in progress"  ? (
        <>
          <h3>Current quizz</h3>
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">{currentRoom.quiz.tname}</h5>
              <small className="mb-1">id: {currentRoom.quiz.quizid} </small> <br></br>
              <small>Date:  {new Date(currentRoom.quiz.created).toISOString().split('T')[0]}</small>
              <div className='d-flex'>
                <button 
                    type="button" 
                    name="edit" 
                    className="btn btn-success btn-sm mt-2" 
                    onClick={() => alert("Room is already in progress, not allow to join")}
                >
                    Room is already in progress
                </button>
                {currentRoom.quiz.uid === user.uid ? (
                  <button type="button" name="start" className="btn btn-danger btn-sm mt-2 ml-2" onClick={() => deleteRoom()}>Delete room</button>
                ): (
                    <button type = "button" name = "start" className = "btn btn-danger btn-sm mt-2 ml-2" onClick={() => leaveRoom()}>Leave</button>
                  )}
              </div>
            </div>
          </div>
        </>
      ): (
        <>
        <h3>Current waiting room will display here if you are in a waiting room for a quiz</h3>
        </>
      )}



    </div>

  );
}

export default HomePage;