// import { io } from "socket.io-client";
// import { userActions } from "./userSlice";

// let socket;

// export const initializeSocket = (dispatch, user) => {
//   if (!socket && user) {
//     socket = io("https://your-backend-url.com", {
//       withCredentials: true,
//       auth: { userId: user._id }
//     });

//     socket.on("connect", () => {
//       dispatch(userActions.socketConnected());
//       console.log("Socket connected");
//     });

//     socket.on("disconnect", () => {
//       dispatch(userActions.socketDisconnected());
//       console.log("Socket disconnected");
//     });

//     socket.on("newMessage", (message) => {
//       dispatch(userActions.receiveMessage({
//         conversationId: message.conversationId,
//         message
//       }));
//     });

//     socket.on("onlineUsers", (users) => {
//       dispatch(userActions.setOnlineUsers(users));
//     });

//     dispatch(userActions.setSocket(socket));
//   }
//   return socket;
// };

// export const getSocket = () => socket;