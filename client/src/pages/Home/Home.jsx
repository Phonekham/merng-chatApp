import { Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../../context/auth";
import Users from "./Users";
import Messages from "./Messages";

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  return (
    <>
      <Row className="bg-white justify-content-around">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white mt-2">
        <Users />
        <Messages />
      </Row>
    </>
  );
};

export default Home;
