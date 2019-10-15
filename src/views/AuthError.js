import React from "react";
import { Container } from "shards-react";

const AuthError = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>401</h2>
        <h3>Dilarang mengakses!</h3>
        <p>Kamu bukan staff yang dapat mengakses halaman ini.</p>
      </div>
    </div>
  </Container>
);

export default AuthError;
