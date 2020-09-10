import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        const signedOutUser = {
          isSignedIn: "false",
          name: "",
          email: "",
          photo: "",
          error: "",
          success: "false",
        };
        setUser(signedOutUser);
      })
      .catch(function (error) {
        // An error happened.
      });
  };
  const handleSubmit = (e) => {
    if (user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch(function (error) {
          // Handle Errors here.
          const newUserInfo = { ...user };
          newUserInfo.success = false;
          newUserInfo.error = error.message;
          setUser(newUserInfo);
          // ...
        });
    }
    e.preventDefault();
  };
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      isFieldValid = isPasswordValid;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSignedIn && (
        <div>
          {" "}
          <p>Welcome, {user.name}</p>
          <p>Email : {user.email}</p>
          <img style={{ width: "50%" }} src={user.photo} alt="" />
        </div>
      )}
      <h1>Our Own Authentication</h1>
      <form onSubmit={handleSubmit}>
        <input
          onBlur={handleBlur}
          type="text"
          name="email"
          id=""
          placeholder="Your Email Address"
          required
        />{" "}
        <br />
        <input
          onBlur={handleBlur}
          type="password"
          name="password"
          id=""
          placeholder="Your Password"
          required
        />{" "}
        <br />
        <input type="submit" value="Submit" />
      </form>
      <h1 style={{ color: "red" }}>{user.error}</h1>
      {user.success && (
        <h1 style={{ color: "green" }}>User Added Successfully!</h1>
      )}
    </div>
  );
}

export default App;
