import useAuthStore from "../stores/authStore";
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
      // const resp = await currentUser(token);
      // console.log(resp);
      const role = token ? user.role : "GUEST"
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
    return <div>Loading...</div>
  }

  if (!isAllowed) {
    console.log('Is allow',isAllowed)
    return <Navigate to={"/unauthorization"} />;
  }

  return element;
};

export default ProtectRoute;
