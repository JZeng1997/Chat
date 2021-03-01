import React, {useRef, useState} from 'react';
import './App.css';
// importing firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// Importing hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDoGUrZgu4ohSPFyz9UscOGUXaV8jA2PlM",
  authDomain: "fir-chat-c59a8.firebaseapp.com",
  projectId: "fir-chat-c59a8",
  storageBucket: "fir-chat-c59a8.appspot.com",
  messagingSenderId: "304767466450",
  appId: "1:304767466450:web:af1bf280a52ef0d768660b",
  measurementId: "G-SC2KP0TJGW"
})

// Make reference to firebase sdks as global vars
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Message</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  // Reference a firestore collection
  const messageRef = firestore.collection('messages');
  // Query for documents in collection
  const query = messageRef.orderBy('createdAt').limit(25);
  // Listen to data with a hook
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');
  // Send message to database
  const sendMessage = async(e) => {
    // Prevent refresh of page
    e.preventDefault()
    const { uid, photoURL} = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }
  const dummy = useRef();
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
    <div className={`message ${messageClass}`}>
      <imgg src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
