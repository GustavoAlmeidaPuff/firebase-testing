import React, { useState, useEffect } from 'react';
import {initializeApp} from 'firebase/app'
import {getFirestore, getDocs, collection, addDoc, doc, deleteDoc, updateDoc} from 'firebase/firestore'

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
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

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

  async function deleteUser(userId) {
    const userDoc = doc(db, 'users', userId);
    await deleteDoc(userDoc);
  }

  const criarUser = async () => {
    try {
      await addDoc(userCollectionRef, { name, email });
      setName('');
      setEmail('');
    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
    }
  };

  const startEditUser = (user) => {
    setEditUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const updateUser = async () => {
    const userDoc = doc(db, 'users', editUserId);
    await updateDoc(userDoc, { name: editName, email: editEmail });
    setEditUserId(null);
    setEditName('');
    setEditEmail('');
  };

  return (
    <div>
      <input 
        type="text"   
        placeholder='nome...' 
        value={name} 
        onChange={(e) => setName(e.target.value)} />
      <input 
        type="text" 
        placeholder='email...'
        value={email} 
        onChange={(e) => setEmail(e.target.value)} />

      <button onClick={criarUser}>create user</button>
      <ul>
        {
          users.map((user) => {
            return (
              <div key={user.id}>
                <li>{user.name}</li>
                <li>{user.email}</li>
                <button onClick={() => deleteUser(user.id)}>Delete user</button>
                <button onClick={() => startEditUser(user)}>Edit user</button>
              </div>
            )
          })}
      </ul>

      {editUserId && (
        <div>
          <h3>Edit User</h3>
          <input 
            type="text" 
            placeholder='Edit name...' 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)} />
          <input 
            type="text" 
            placeholder='Edit email...' 
            value={editEmail} 
            onChange={(e) => setEditEmail(e.target.value)} />
          <button onClick={updateUser}>Save changes</button>
        </div>
      )}
    </div>
  );
};