import useAuthStore from "../store/auth-store";
import { currentUser } from "../api/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectRoute = ({ element, allow }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  // console.log('token from Protectroute', token)
  // console.log('role from Protectroute', user.user.role)

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const resp = await currentUser(token);
      console.log(resp);
      const role = resp.data.member.role;
      console.log("role from backend", role);
      console.log("allowance",allow)
      if (allow.includes(role)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch (err) {
      console.log(err);
      setIsAllowed(false);
    }
  };
  if (isAllowed === null) {
    return <div>Loading...</div>; //ทำloading 1 จังหวะเฉยๆ
  }

  // if (!isAllowed) {
  //   console.log('Is allow',isAllowed)
  //   return <Navigate to={"/unauthorization"} />;
  // }

  return element;
};

export default ProtectRoute;
