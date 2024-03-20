import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../App';
const Leaderboard = ({ leaderboardData }) => {
    // Create an array from the map data for easier manipulation
    const data = Object.keys(leaderboardData).map((email) => ({
        name: leaderboardData[email].fname,
        points: leaderboardData[email].score
    }));

    const sortedData = [...data].sort((a, b) => b.points - a.points);
    const maxPoints = sortedData[0] ? sortedData[0].points : 0;

    return (
        <div className="container">
            <h1>Leaderboard</h1>
            {sortedData.map((student, index) => (
                <div className="my-2" key={index}>
                    <div className="d-flex justify-content-between">
                        <span>{student.name}</span>
                        <span>{student.points} points</span>
                    </div>
                    <div className="progress">
                        <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{width: `${(student.points / maxPoints) * 100}%`}} 
                            aria-valuenow={student.points} 
                            aria-valuemin="0" 
                            aria-valuemax={maxPoints}
                        ></div>
                    </div>
                </div>
            ))}
            
        </div>
    );
}

export default Leaderboard;

// const Leaderboard = () => {
//     const data = [
//         { name: 'John', points: 100 },
//         { name: 'Jane', points: 150 },
//         { name: 'Jim', points: 80 },
//         { name: 'Jack', points: 120 },
//         { name: 'Jill', points: 95 },
//     ];

//     const sortedData = [...data].sort((a, b) => b.points - a.points);
//     const maxPoints = sortedData[0].points;

//     return (
//         <div className="container">
//             <h1>Leaderboard</h1>
//             {sortedData.map((student, index) => (
//                 <div className="my-2" key={index}>
//                     <div className="d-flex justify-content-between">
//                         <span>{student.name}</span>
//                         <span>{student.points} points</span>
//                     </div>
//                     <div className="progress">
//                         <div 
//                             className="progress-bar" 
//                             role="progressbar" 
//                             style={{width: `${(student.points / maxPoints) * 100}%`}} 
//                             aria-valuenow={student.points} 
//                             aria-valuemin="0" 
//                             aria-valuemax={maxPoints}
//                         ></div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default Leaderboard;