import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { socket } from "../utils/socket";
import { getUserInfo } from "../redux/reducers/auth.slice";
import { toast } from "react-hot-toast";

function NotificationService() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      dispatch(getUserInfo(decodedToken.userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return;
    }

    function onConnect() {
      console.log("Connected");
    }

    function onDisconnect() {
      console.log("Disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.emit("joinNotification", user.userId);

    socket.on("notification", (message) => {
      console.log("New message", message);
      // toast.success("New Message from");
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, [user]);

  return null;
}

export default NotificationService;
