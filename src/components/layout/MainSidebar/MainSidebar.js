import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'shards-react';
import SidebarContext from 'contexts/SidebarContext';

import SidebarMainNavbar from './SidebarMainNavbar';
import SidebarSearch from './SidebarSearch';
import SidebarNavItems from './SidebarNavItems';

const MainSidebar = props => {
  const sidebarState = React.useContext(SidebarContext);

  const classes = classNames(
    'main-sidebar',
    'px-0',
    'col-12',
    sidebarState.visible && 'open'
  );

  return (
    <Col tag="aside" className={classes} lg={{ size: 2 }} md={{ size: 3 }}>
      <SidebarMainNavbar hideLogoText={props.hideLogoText} />
      <SidebarSearch />
      <SidebarNavItems />
    </Col>
  );
};

// class MainSidebar extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       menuVisible: false
//     };
//   }

//   toggleSidebar = () => {
//     this.setState(prevState => ({
//       menuVisible: !prevState.menuVisible
//     }));
//   };

//   render() {
//     const classes = classNames(
//       'main-sidebar',
//       'px-0',
//       'col-12',
//       this.state.menuVisible && 'open'
//     );

//     return (
//       <Col tag="aside" className={classes} lg={{ size: 2 }} md={{ size: 3 }}>
//         <SidebarMainNavbar
//           toggleSidebar={this.toggleSidebar}
//           hideLogoText={this.props.hideLogoText}
//         />
//         <SidebarSearch />
//         <SidebarNavItems />
//       </Col>
//     );
//   }
// }

MainSidebar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

MainSidebar.defaultProps = {
  hideLogoText: false
};

export default MainSidebar;
