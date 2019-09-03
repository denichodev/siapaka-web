import React from "react";
import PropTypes from "prop-types";
import { Container } from "shards-react";
import styled from 'styled-components';

const FullHeightContainer = styled(Container)`
  height: 100vh;
`;

const ContainerOnly = ({ children, noNavbar, noFooter }) => (
  <FullHeightContainer fluid>{children}</FullHeightContainer>
);

ContainerOnly.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

ContainerOnly.defaultProps = {
  noNavbar: true,
  noFooter: true
};

export default ContainerOnly;
