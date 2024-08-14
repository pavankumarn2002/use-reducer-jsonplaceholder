export const initialState = {
    posts: [],
    loading: false,
    error: null,
  };
  
  export const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_POSTS_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_POSTS_SUCCESS':
        return { ...state, loading: false, posts: action.payload };
      case 'FETCH_POSTS_FAILURE':
        return { ...state, loading: false, error: action.payload };
  
      case 'ADD_POST':
        return { ...state, posts: [action.payload, ...state.posts] };
      case 'DELETE_POST':
        return { ...state, posts: state.posts.filter(post => post.id !== action.payload) };
      case 'UPDATE_POST':
        return {
          ...state,
          posts: state.posts.map(post =>
            post.id === action.payload.id ? { ...post, ...action.payload } : post
          ),
        };
  
      default:
        return state;
    }
  };
  