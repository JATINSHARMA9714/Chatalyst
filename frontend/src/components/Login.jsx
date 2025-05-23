import React, { useState,useContext, use } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import {UserContext} from '../context/UserContext';

const Login = () => {

   const [email,setEmail]=useState('') 
   const [password,setPassword]=useState('') 


   const {setUser}=useContext(UserContext) // Destructure setUser from UserContext;

   const navigate = useNavigate();
  
    const handleSubmit = (event) => {
     event.preventDefault();
     const email = event.target.email.value;
     const password = event.target.password.value;

    // Perform login logic here (e.g., API call)
    axios.post('/users/login', { email, password })
      .then((response) => {
        // Handle successful login (e.g., store token, redirect)
        // console.log('Login successful:',response.data);


        localStorage.setItem('token', response.data.token); // Store token in local storage


        setUser(response.data.user); // Assuming the response contains user data
        
        navigate('/'); // Redirect to home page or dashboard
      })
      .catch((error) => {
        // Handle error (e.g., show error message)
        console.error('Login error:', error);

        setEmail('');
        setPassword('');
      });

    // Redirect or show success message
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0e10]">
      <div className="max-w-md p-8 bg-opacity-50 bg-[#161718] rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 text-gray-100 bg-[#313131]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 text-gray-100 bg-[#313131] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;