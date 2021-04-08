// import logo from './logo.svg';
import React, { useEffect, useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

import './App.css';

require('dotenv').config()

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD_muHflK7VI_O2CCFmfQm-MTzsNk9haqs",
  authDomain: "chat-room-app-react.firebaseapp.com",
  projectId: "chat-room-app-react",
  storageBucket: "chat-room-app-react.appspot.com",
  messagingSenderId: "623841188583",
  appId: "1:623841188583:web:7a21fb389f5f49b02de042",
  measurementId: "G-RDZ84SFYYE"
};


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <Container fluid >
        <Jumbotron><h1>Chat Room</h1>
          {user ? <span>Hello, {user.displayName}! </span> : <p>You should login first</p>}
        </Jumbotron>
        {user ? <div> <Chatroom /> <hr /><SignOut /> </div> : <SignIn />}
        {/* <SignIn /> */}
        {/* <img width="400" src="google-sign-in-button.png" alt="sign in with google"></img> */}
      </Container>
    </div>
  );
}


function Chatroom() {
  const messagesRef = firestore.collection('messages')
  const query = messagesRef
    .orderBy('createdAt', 'asc')
    .limitToLast(25)
  const [messages] = useCollectionData(query, { idField: 'id' })
  const [msg, setMsg] = useState('')

  // asynchronous function
  const sendMessage = async (e) => {
    e.preventDefault() // prevent unexpected input during this function execution

    // const displayName = auth.currentUser.displayName
    // const uid = auth.currentUser.uid
    // const photoURL = auth.currentUser.photoURL
    const { displayName, uid, photoURL } = auth.currentUser

    await messagesRef.add({
      user: displayName,
      body: msg,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photoURL: photoURL
    })

    setMsg('')
    // dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  const handleOnChange = (e) => {
    console.log(e.target.value)
    setMsg(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      // console.log("Enter is pressed.", e.target.value)
      if (e.target.value.trim() !== '') {
        sendMessage(e)
      }
    }
  }

  return (
    <div>
      <div>
        {messages && messages.map(m => <ChatMessage message={m} />)}
      </div>
      <input
        value={msg}
        onChange={handleOnChange}
        onKeyPress={handleKeyPress}
        placeholder="Say something" />{' '}
      <Button onClick={sendMessage} variant="secondary">send</Button>
    </div >
  )
}


function ChatMessage(props) {
  const { user, body, uid, photoURL, createdAt } = props.message
  return (
    <table>
      <tbody>
        <tr>
          <td rowSpan={2}>
            <img width="40" src={photoURL || 'https://i.imgur.com/rFbS5ms.png'} alt="{user}'s pfp" />
          </td>
          <td>{user}</td>
        </tr>
        <tr>
          <td>{body}</td>
        </tr>
      </tbody>
    </table >
  )
}


function SignOut() {
  return auth.currentUser && (
    <div>
      <Button onClick={() => auth.signOut()} variant="info">Sign Out</Button>
    </div>
  )
}


function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return (
    <div>
      <button onClick={signInWithGoogle}>
        <img width="400"
          src="google-sign-in-button.png"
          alt="sign in with google">
        </img>
      </button>
    </div>
  )
}

export default App;
