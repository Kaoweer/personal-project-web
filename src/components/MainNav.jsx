import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const MainNav = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="flex p-5 px-10 gap-4 bg-primary">
      <div className="flex w-full justify-between">
        <Link to={"/"}>
          <img className="h-[50px]" src="/src/assets/logo.png" />
        </Link>

        <div>
          <ul className="flex gap-4 font-normal items-center">
            <Link to={"/program"}>Program</Link>
            {/* <Link to={"/program"}>Exercise</Link> */}
            {token && user.role === "ADMIN" ? (
              <Link
                className="btn rounded-full bg-transparent"
                to={"/admin/verify"}
              >
                Verify user
              </Link>
            ) : (
              <></>
            )}
            <h1>|</h1>
            <div className="flex gap-2 font-bold">
              {token ? <Link to={"/user/home"}>{user.username}</Link> : <></>}
              {token ? (
                <Link to={"/"} onClick={logout}>
                  Logout
                </Link>
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
