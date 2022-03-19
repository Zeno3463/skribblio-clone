import { Server } from 'socket.io';
import { v4 } from 'uuid';
import randomWords from 'random-words';

let currRoomId = v4();
let currUsers: Array<string> = [];
const roomUserLimit = 12;

const handler = (req: any, res: any) => {
	if (res.socket.server.io) console.log('server is already running');
	else {
		const io = new Server(res.socket.server);
	
		io.on('connection', socket => {
			console.log('connected');

			socket.on('join-room', newUserName => {
				if (currUsers.length >= roomUserLimit) {
					currUsers = [];
					currRoomId = v4();
				}
				currUsers.push(newUserName);
				socket.join(currRoomId);
				io.to(currRoomId).emit('join-room', {currRoomId, currUsers});
			})

			socket.on('start-round', roomId => {
				io.to(roomId).emit('start-round', randomWords({exactly: 3, maxLength: 9}));
			})

			socket.on('update-answer', ({newAnswer, roomId}) => {
				io.to(roomId).emit('update-answer', newAnswer);
			})

			socket.on('update-chat', ({chat, newInputVal, roomId}) => {
				io.to(roomId).emit('update-chat', [...chat, newInputVal]);
			})
		})
	
		res.socket.server.io = io;
	}

	res.end();
}

export default handler;