import React, { useEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw';
import io, { Socket } from 'socket.io-client';
let socket: Socket;

const Room = () => {
	const [answer, setAnswer] = useState("");
	const [answerChoices, setAnswerChoices] = useState<Array<string>>();
	const [inputVal, setInputVal] = useState("");
	const [chat, setChat] = useState<Array<string>>([]);
	const [userName, setUserName] = useState("");
	const [users, setUsers] = useState<Array<string>>([]);
	const [roomId, setRoomId] = useState("");
	const [drawer, setDrawer] = useState(0);
	const [roundStarted, setRoundStarted] = useState(false);

	useEffect(() => {
		fetch('/api/socket').finally(() => {
			socket = io();

			socket.on('connect_error', err => console.log(err))

			socket.on('connect', () => console.log('Connected to server'))

			socket.on('join-room', data => {
				const { currRoomId, currUsers } = data;
				setRoomId(currRoomId);
				setUsers(currUsers);
				console.log(currUsers);
				if (answer) socket.emit('update-answer', { newAnswer: answer, roomId: roomId });
				else if (currUsers.length === 1) socket.emit('start-round', roomId);
			})

			socket.on('update-answer', newAnswer => {
				console.log(newAnswer);
				setAnswer(newAnswer);
			})

			socket.on('start-round', answerChoices => {
				console.log(answerChoices);
				setAnswerChoices(answerChoices);
				setRoundStarted(true);
			})
		})
	}, []);

	const updateChat = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return;
		socket.emit('update-chat', inputVal);
		setInputVal("");
	}

	return <div>
		{roomId ? null :
		<div>
			<button onClick={() => socket.emit('join-room', userName)}>join room</button>
			<input type="text" placeholder='enter username' onChange={e => setUserName(e.target.value)} />
		</div>}
		{answer !== "" ? answer :
		<div>
			{answerChoices?.map((choice, i) => <button key={i} onClick={() => socket.emit('update-answer', {newAnswer: choice, roomId: roomId})}>{choice}</button>)}
		</div>}
		{users![drawer] === userName ? <div>
		</div>: null}
		<div>
			{users.map((user, index) => <div key={index}>{user}</div>)}
		</div>
		<CanvasDraw />
		<input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={updateChat} />
		<div>
			{chat?.map((chat, index) => <p key={index}>{chat}</p>)}
		</div>
	</div>
}

export default Room