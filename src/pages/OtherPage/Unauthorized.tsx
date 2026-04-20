import React from 'react';
import { Link } from 'react-router';
import Button from '../../components/ui/button/Button';
import PageMeta from '../../components/common/PageMeta';

const Unauthorized = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-5 text-center">
      <PageMeta
        title="Unauthorized Access | Digital Maples Labs"
        description="You do not have permission to view this page."
      />
      <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
        Access Denied
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        You do not have the required permissions to access this page. Please contact a super admin if you believe this is an error.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
