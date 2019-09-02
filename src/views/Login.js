import React from 'react';

export default () => {

  React.useEffect(() => {
    fetch('http://localhost:8080/api').then(res => res.json()).then(console.log)
  })

  return (
    <div>Login</div>
  );
};
