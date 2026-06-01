import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import ScrollToTop from "./ScrollToTop";
import ChatBot from "./ChatBot";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser, setAuthChecked } from "@/redux/authSlice";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    fetchProfile();
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Outlet />
      <ChatBot />
    </>
  );
};

export default Layout;