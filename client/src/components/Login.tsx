import React, { useState } from 'react';
import { useAuth } from './userContext';

const Login = () => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add your authentication logic
    // For simplicity, let's just call loginUser when the form is submitted
    loginUser();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className='m-3 text-center '>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className='form-label'>Brand protector email:</label>
          <input
            type="email"
            id="email"
            className='form-control'
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className='btn btn-primary mt-3'>Login</button>
      </form>
    </div>
  );
};

export default Login;
