import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      token
      createdAt
    }
  }
`;

export default function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [loginUser, { data, loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      dispatch({ type: "LOGIN", payload: data.login });
      props.history.push("/");
    },
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              Username
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.username && "is-invalid"}
              value={variables.username}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              Password
            </Form.Label>
            <Form.Control
              type="password"
              className={errors.password && "is-invalid"}
              value={variables.password}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
            <small>
              Dont have account <Link to="/register">Register</Link>{" "}
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
