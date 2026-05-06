import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.DEV
    ? ""
    : (import.meta.env.VITE_Auto_Scaling_Base_Url ? import.meta.env.VITE_Auto_Scaling_Base_Url.replace('/api/v1', '') : "http://localhost:6000");

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ["websocket"],
        });
        console.log("🔌 Frontend Socket.io initialized at", SOCKET_URL);
    }
    return socket;
};
