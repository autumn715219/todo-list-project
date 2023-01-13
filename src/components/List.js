import './list.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../utils/firebase.js';
import { signOut } from 'firebase/auth';
import { uid } from 'uid';
import { set, ref, onValue, remove } from 'firebase/database';

import AddIcon from '../assect/add.svg';
import DeleteIcon from '../assect/delete.svg';
import LogoutIcon from '../assect/signout.svg';

export default function List() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate('/');
      }
    });
  }, []);
  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
    });
    setTodo('');
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  return (
    <div className='WRAPPER'>
      <div className='list'>
        <h1>Todo List</h1>
        <input
          type='text'
          placeholder='add todo...'
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button className='btn_add' onClick={writeToDatabase}>
          <img src={AddIcon} />
        </button>
        <div className='todo_container'>
          {todos.map((todo, index) => (
            <div className='todo' key={index}>
              <div className='todo_txt'>{todo.todo}</div>
              <button className='btn_delete' onClick={() => handleDelete(todo.uidd)}>
                <img src={DeleteIcon} alt='刪除' />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button className='btn_logout' onClick={handleSignOut}>
        <img src={LogoutIcon} alt='登出' />
      </button>
    </div>
  );
}
