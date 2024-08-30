import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import ChatRoom from './components/Chatroom/Chatroom';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
  
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/chatroom" element={<ProtectedRoute element={<ChatRoom />} />} />
      </Routes>
    
  );
};

export default App;
