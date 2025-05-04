import React, { createContext, useState } from 'react';

// Create the UserContext
export const UserContext = createContext();
// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to store logged-in user details


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

