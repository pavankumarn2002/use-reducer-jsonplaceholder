import React, { useReducer, useEffect, useState } from 'react';
import { initialState, reducer } from './reducer';
import styles from './App.css';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch({ type: 'FETCH_POSTS_REQUEST' });
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_POSTS_FAILURE', payload: error.message });
      }
    };

    fetchPosts();
  }, []);

  const addPost = async () => {
    const newPost = { title, body };
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    dispatch({ type: 'ADD_POST', payload: data });
    setTitle('');
    setBody('');
  };

  const deletePost = async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    });
    dispatch({ type: 'DELETE_POST', payload: id });
  };

  const updatePost = async () => {
    const updatedPost = { id: editingId, title, body };
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editingId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedPost),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    dispatch({ type: 'UPDATE_POST', payload: data });
    setTitle('');
    setBody('');
    setEditingId(null);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditingId(post.id);
  };

  return (
    <div className="container">
      <h1>Posts</h1>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}

      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input"
        />
        {editingId ? (
          <button onClick={updatePost} className="button">Update Post</button>
        ) : (
          <button onClick={addPost} className="button">Add Post</button>
        )}
      </div>

      <ul className="postList">
        {state.posts.map(post => (
          <li key={post.id} className="postItem">
            <h2 className="postTitle">{post.title}</h2>
            <p className="postBody">{post.body}</p>
            <button onClick={() => handleEdit(post)} className="editButton">Edit</button>
            <button onClick={() => deletePost(post.id)} className="deleteButton">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
