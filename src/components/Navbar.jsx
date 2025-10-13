import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <Link to="/" className="text-2xl font-bold">
          JobMatch AI
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;