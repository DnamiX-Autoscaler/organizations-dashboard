import { io } from "socket.io-client";

const SOCKET_FLAG = import.meta.env.VITE_ENABLE_AUTOSCALING_SOCKET;
const SOCKET_ENABLED = SOCKET_FLAG === "true" || SOCKET_FLAG === "1";

const SOCKET_URL = import.meta.env.DEV
    ? ""
    : (import.meta.env.VITE_Auto_Scaling_Base_Url ? import.meta.env.VITE_Auto_Scaling_Base_Url.replace('/api/v1', '') : "http://localhost:6000");

let socket;
let disabledNoticeShown = false;

export const getSocket = () => {
    if (!SOCKET_ENABLED) {
        if (!disabledNoticeShown) {
            console.info("Socket.io is disabled. Set VITE_ENABLE_AUTOSCALING_SOCKET=true to enable realtime scaling events.");
            disabledNoticeShown = true;
        }
        return null;
    }

    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ["websocket"],
            timeout: 3000,
            reconnectionAttempts: 3,
        });
        console.log("🔌 Frontend Socket.io initialized at", SOCKET_URL);
    }
    return socket;
};
