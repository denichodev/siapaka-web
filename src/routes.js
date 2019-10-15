import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, ContainerOnly } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Home from "./views/Home";
import Doctor from "./views/Doctor";
import Staff from "./views/Staff";
import Supplier from "./views/Supplier";
import Login from "./views/Login";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/home" />
  },
  {
    path: "/login",
    exact: true,
    layout: ContainerOnly,
    component: Login
  },
  {
    path: "/home",
    layout: DefaultLayout,
    component: Home
  },
  {
    path: "/karyawan",
    layout: DefaultLayout,
    component: Staff
  },
  {
    path: "/supplier",
    layout: DefaultLayout,
    component: Supplier
  },
  {
    path: "/dokter",
    layout: DefaultLayout,
    component: Doctor
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
