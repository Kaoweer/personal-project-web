import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const MainNav = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore(state => state.logout)
  return (
    <div className="flex p-5 px-10 gap-4 bg-primary">
      <div className="flex w-full justify-between">
        <Link to={"/"}>Logo</Link>

        <div>
          <ul className="flex gap-4 font-normal">
            <Link to={"/program"}>Program</Link>
            <Link to={"/program"}>Exercise</Link>
            <h1>|</h1>
            <div className="flex gap-2 font-bold">
              {token ? (
                <Link to={"/user/home"}>{user.username}</Link>
              ) : (
                <Link to={"/register"}>Register</Link>
              )}
              {token ? (
                <Link onClick={logout}>Logout</Link>
              ) : (
                <Link to={"/auth/login"}>Login</Link>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
