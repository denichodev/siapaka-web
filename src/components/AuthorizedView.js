import React from "react";
import UserContext from "contexts/UserContext";

const permissions = {
  ADM: [
    "read-doctor",
    "edit-doctor",
    "add-doctor",
    "delete-doctor",
    "read-supplier",
    "edit-supplier",
    "add-supplier",
    "delete-supplier",
    "read-staff",
    "edit-staff",
    "add-staff",
    "delete-staff"
  ],
  KG: ["read-doctor", "read-supplier"],
  KAS: ["read-doctor", "read-supplier"]
};

const AuthorizedView = props => {
  const userData = React.useContext(UserContext);
  const role = userData && userData.me && userData.me.role_id;

  if (!props.permissionType) {
    return null;
  }

  if (permissions[role] && permissions[role].includes(props.permissionType)) {
    return <>{props.children}</>;
  }

  return props.fallback ? <>{props.fallback}</> : null;
};

export default AuthorizedView;
