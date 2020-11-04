import { Container, Col, Row } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import DymnamicRoute from "./utils/DynamicRoute";

import ApolloProvider from "./ApolloProvider";
import "./App.scss";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <DymnamicRoute exact path="/" component={Home} authenticated />
              <DymnamicRoute path="/register" component={Register} />
              <DymnamicRoute path="/login" component={Login} />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
