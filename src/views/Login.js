import React from "react";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  Button,
  Row,
  Col
} from "shards-react";
import styled from "styled-components";
import {withRouter} from 'react-router-dom';
import UserContext from "contexts/UserContext";

import { useTextInput } from "hooks";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const LoginCard = styled(Card)`
  width: 320px;
`;

const Login = (props) => {
  const [email, setEmail] = useTextInput();
  const [password, setPassword] = useTextInput();

  const userContext = React.useContext(UserContext);
  const handleLogin = (e) => {
    e.preventDefault();

    console.log('props', props);

    userContext
      .login(email, password)
      .then(res => {
        userContext.setAuthToken(res.data.access_token)
      })
      .catch(err => {
        if (err === 401) {
          console.log('salah')
        }
      });
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <CardBody>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <FormInput
                value={email}
                id="#email"
                placeholder="Email"
                onChange={setEmail}
              />
            </FormGroup>
            <FormGroup>
              <FormInput
                value={password}
                type="password"
                id="#password"
                placeholder="Password"
                onChange={setPassword}
              />
            </FormGroup>
            <Row>
              <Col lg={{ size: 4, offset: 8 }}>
                <Button type="submit">
                  Masuk
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </LoginCard>
    </LoginWrapper>
  );
};

export default withRouter(Login);
