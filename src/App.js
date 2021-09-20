import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import "./global.css";
import { init, requestSignIn } from "@textile/near-storage";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";

// React Router

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// utilities
import { login, logout } from "./utils";

// React Bootstrap
import { Navbar, Nav, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Image Assets
import logo from "./assets/Logo.svg";

import getConfig from "./config";
import UploadCenter from "./Components/UploadCenter";
import BlockFeed from "./Components/BlockFeed";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  // useEffect(() => {
  //   const getConnection = async () => {
  //     await connectToFileCoin();
  //   };
  //   getConnection();
  // }, []);

  return (
    <Router>
      <Navbar bg='light' expand='lg'>
        <Container>
          <Navbar.Brand href='/'>
            <img style={{ width: "10vw" }} src={logo} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'></Nav>
            <Nav.Link href='/'>Home</Nav.Link>
            <Nav.Link href='/profile'>Profile</Nav.Link>
            <Nav.Link href='/upload'>Upload</Nav.Link>
            <Nav.Link
              onClick={window.walletConnection.isSignedIn() ? logout : login}
            >
              {window.walletConnection.isSignedIn()
                ? window.accountId
                : "Login"}
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row className='justify-content-center d-flex'>
          <Switch>
            <Route path='/' exact>
              <BlockFeed />
            </Route>
            <Route path='/upload' exact>
              <UploadCenter />
            </Route>
            <Route path='/profile' exact>
              User Profile
            </Route>
          </Switch>
        </Row>
      </Container>
    </Router>
  );
}
