import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SidebarContext, { defaultValue } from 'contexts/SidebarContext';
import { UserProvider } from 'contexts/UserContext';
import { CacheProvider } from 'rest-hooks';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/shards-dashboards.1.1.0.min.css';

import routes from './routes';

export default () => {
  const [sidebarState, setSidebarState] = React.useState({
    ...defaultValue,
    toggle: () => {
      setSidebarState(prevState => ({
        ...prevState,
        visible: !prevState.visible
      }));
    }
  });

  return (
    <CacheProvider>
      <SidebarContext.Provider value={sidebarState}>
        <Router basename={process.env.REACT_APP_BASENAME || ''}>
          <UserProvider>
            <div>
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={props => (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    )}
                  />
                );
              })}
            </div>
          </UserProvider>
        </Router>
      </SidebarContext.Provider>
    </CacheProvider>
  );
};
