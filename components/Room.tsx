import React, { useEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw';
import io, { Socket } from 'socket.io-client';
import randomWords from 'random-words';
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

			socket.on('update-chat', newChat => {
				setChat(newChat);
			})
		})
	}, []);

	const updateChat = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return;
		socket.emit('update-chat', { chat, newInputVal: `${userName}: ${inputVal}`, roomId });
		setInputVal("");
	}

	return <div>
		{roomId ? null :
		<div>
			<button id='join-room' onClick={() => socket.emit('join-room', userName)}>join room</button>
			<input type="text" id='username' placeholder='enter username' onChange={e => setUserName(e.target.value)} />
		</div>}

		{users![drawer] === userName ? <div>
			{answer !== "" ? answer :
			<div>
				{answerChoices?.map((choice, i) => <button key={i} onClick={() => socket.emit('update-answer', {newAnswer: choice, roomId: roomId})}>{choice}</button>)}
			</div>}
		</div>: null}
		
		<div id='users'>
			{users.map((user, index) => <div key={index}>{user}</div>)}
		</div>
		
		<CanvasDraw />
		
		<input type="text" id='chat-input' value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={updateChat} />
		<div id='chat-log'>
			{chat?.map((chat, index) => <p key={index}>{chat}</p>)}
		</div>
	</div>
}

export default Room