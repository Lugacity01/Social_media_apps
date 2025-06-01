import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import MessagesList from "./components/MessagesList";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import { Provider } from "react-redux";
import store from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />, // Landing page at root "/"
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/app", // or keep it "/"
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />, // Will be at "/app"
      },
      {
        path: "messages",
        element: <MessagesList />, // "/app/messages"
      },
      {
        path: "messages/:receiverId",
        element: <Messages />,
      },
      {
        path: "bookmarks",
        element: <Bookmarks />,
      },
      {
        path: "users/:id",
        element: <Profile />,
      },
      {
        path: "posts/:id",
        element: <SinglePost />,
      },
    ],
  },
]);


const App = () => {
  return (
    <Provider store={store}>
      <>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
      </>
    </Provider>
  );
};

export default App;
