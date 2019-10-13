import React from 'react';
import SidebarContext from 'contexts/SidebarContext';
const NavbarToggle = props => {
  const sidebarState = React.useContext(SidebarContext);

  return (
    <nav className="nav">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        onClick={sidebarState.toggle}
        className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center"
      >
        <i className="material-icons">&#xE5D2;</i>
      </a>
    </nav>
  );
};

export default NavbarToggle;
