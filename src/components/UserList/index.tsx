import React from 'react';

import './UserList.scss';

interface User {
  name:string;
}
interface UserListTypes{
  joinedUsers:User[];
}
function UserList({ joinedUsers }:UserListTypes) {
  return (
    <div className='userList'>
      {joinedUsers.map((user) => (
        <p key={user.name} className='user'>
          <i className='fa fa-user-circle'></i>
          <span>{user.name}</span>
        </p>
      ))}
    </div>
  );
}

export default UserList;
