import React from "react";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  Button,
  Row,
  Col,
  FormFeedback
} from "shards-react";
import useForm from "react-hook-form";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import UserContext from "contexts/UserContext";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const LoginCard = styled(Card)`
  width: 320px;
`;

const Login = props => {
  const { handleSubmit, register, errors } = useForm();
  const [networkError, setNetworkError] = React.useState("");

  const userContext = React.useContext(UserContext);
  const handleLogin = values => {
    userContext
      .login(values.email, values.password)
      .then(res => {
        userContext.setAuthToken(res.data.success.token);
      })
      .catch(err => {
        if (err.response.status === 401) {
          setNetworkError("Email atau password salah.");
        }
      });
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <CardBody>
          <Form onSubmit={handleSubmit(handleLogin)}>
            <FormGroup>
              <FormInput
                name="email"
                id="email"
                placeholder="example@gmail.com"
                invalid={!!errors.email || networkError.length}
                innerRef={register({
                  required: "Wajib diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Email tidak valid"
                  }
                })}
              />
            </FormGroup>
            <FormGroup>
              <FormInput
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                invalid={!!errors.password || networkError.length}
                innerRef={register({
                  required: "Wajib diisi"
                })}
              />

              <FormFeedback invalid={networkError && networkError.length}>
                {networkError}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col lg={{ size: 4, offset: 8 }}>
                  <Button type="submit">Masuk</Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </CardBody>
      </LoginCard>
    </LoginWrapper>
  );
};

export default withRouter(Login);
