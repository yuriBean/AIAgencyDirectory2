import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';

const NotificationsTable = ({ notifications, onClear }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="relative">
<div className="flex items-center justify-end p-4 bg-primary text-white border-l-2 border-gray-200">
<button onClick={toggleDropdown} className="relative mx-3">
          <FontAwesomeIcon icon={faBell} className="text-2xl" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {showDropdown && (
        <div className="absolute right-0 w-1/3 bg-secondary text-white border rounded shadow-lg z-10">
       <div className='text-lg py-2 px-4 font-bold bg-primary'><p>Notifications</p>
            </div>
          <ul className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <li key={notification.id} className="flex justify-between items-center px-4 py-2">
                  <div>
                  <span>{notification.message}</span>
                  {notification.agencyId && (
                  <a href={`https://aiagencydirectory.com/agency/${notification.agencyId}`} target='_blank' rel="noreferrer" className="text-blue-500 text-xs mx-1 underline">
                  <span>Click to see</span>
                  </a>)}
                  </div>
                  <button onClick={() => onClear(notification.id)} className="text-red-500">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center px-4 py-2">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsTable;
