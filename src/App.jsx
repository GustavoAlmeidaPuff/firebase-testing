import React, { useState, useEffect } from 'react';
import {initializeApp} from 'firebase/app'
import {getFirestore, getDocs, collection} from 'firebase/firestore'

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAkD-9XrevsAim-XZATDpq-OsMDclsq6as",
  authDomain: "fir-test-e03ac.firebaseapp.com",
  projectId: "fir-test-e03ac",
  storageBucket: "fir-test-e03ac.firebasestorage.app",
  messagingSenderId: "185503973159",
  appId: "1:185503973159:web:208bb4dbbb947da1dbb302",
  measurementId: "G-84XXD6BVVE"
});

export const App = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, 'users');

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      const usersData = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      setUsers(usersData);
    }
    getUsers();
  }, [userCollectionRef]);

  return (
    <div>
      <ul>
        {
          users.map((user) => {
            return (
              <div key={user.id}>
                <li>{user.name}</li>
                <li>{user.email}</li>
              </div>
            )
          })}
      </ul>
    </div>
  );
};