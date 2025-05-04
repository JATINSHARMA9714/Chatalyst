import { io } from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (socketInstance) return socketInstance; // prevent multiple instances

    socketInstance = io(import.meta.env.VITE_API_URL, {
        autoConnect: false,
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId: (projectId._id || projectId[0]._id.toString())
        }
    });

    socketInstance.connect(); // manually connect

    return socketInstance;
};

export const receiveMessage = (eventName, callback) => {
    if (socketInstance) {
        socketInstance.on(eventName, callback);
    }
};

export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
};
