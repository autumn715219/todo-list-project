import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB2Ve5JAY_V16JkWr-ZfhjnwUn4IZNWZnk',
  authDomain: 'todo-list-project-f7639.firebaseapp.com',
  databaseURL: 'https://todo-list-project-f7639-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'todo-list-project-f7639',
  storageBucket: 'todo-list-project-f7639.appspot.com',
  messagingSenderId: '309974166660',
  appId: '1:309974166660:web:e324b4c2404f48e1aae6d1',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
