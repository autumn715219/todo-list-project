import './list.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../utils/firebase.js';
import { signOut } from 'firebase/auth';
import { set, ref, get, child, remove, update } from 'firebase/database';

import AddIcon from '../assect/add.svg';
import DeleteIcon from '../assect/delete.svg';
import CompleteIcon from '../assect/complete.svg';
import LogoutIcon from '../assect/signout.svg';

export default function List() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        readData();
      } else if (!user) {
        navigate('/');
      }
    });
  });

  const readData = async () => {
    const dbRef = ref(db);
    await get(child(dbRef, `/${auth.currentUser.uid}`))
      .then((snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setTodos([]);
          Object.values(data).map((todo) => setTodos((oldArray) => [...oldArray, todo]));
        } else {
          setTodos([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    const id = Date.now();
    set(ref(db, `/${auth.currentUser.uid}/${id}`), {
      id: id,
      todo: todo,
      complete: false,
    });
    setTodo('');
    readData();
  };

  // delete
  const handleDelete = (id) => {
    console.log(id);
    remove(ref(db, `/${auth.currentUser.uid}/${id}`));
    readData();
  };

  const handleComplete = (id) => {
    console.log(id);
    update(ref(db, `/${auth.currentUser.uid}/${id}`), {
      complete: true,
    });
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
          <img src={AddIcon} alt='加入按鈕' />
        </button>
        <div className='todo_container'>
          {todos.map((todo, index) => (
            <div className={todo.complete ? 'todo strike' : 'todo'} key={index}>
              <div className='todo_txt'>{todo.todo}</div>
              <button
                className={todo.complete ? 'btn_not_complete btn' : 'btn_complete btn'}
                onClick={() => handleComplete(todo.id)}
              >
                <img src={CompleteIcon} alt='完成按鈕' />
              </button>
              <button className='btn_delete btn' onClick={() => handleDelete(todo.id)}>
                <img src={DeleteIcon} alt='刪除按鈕' />
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
