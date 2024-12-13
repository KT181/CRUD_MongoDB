import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });

  // 獲取所有用戶
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // 新增用戶
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users', newUser);
      setUsers([...users, response.data]);  // 更新用戶列表
      setNewUser({ name: '', email: '', phone: '' });  // 清空表單
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // 刪除用戶
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter(user => user._id !== id));  // 更新用戶列表
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

   // 從外部API取得資料並儲存到資料庫
   const fetchAndSaveUsers = async () => {
    try {
      // 從外部API取得資料
      const response = await axios.get('https://fake-json-api.mock.beeceptor.com/users');
      const usersData = response.data;

      // 將資料逐一送到後端存儲
      for (const user of usersData) {
        await axios.post('http://localhost:5000/users', {
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      }

      // 更新本地的用戶列表
      fetchUsers();
      alert('Users from external API have been saved to the database!');
    } catch (error) {
      console.error('Error fetching and saving users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Bento Store Users</h1>

      <h2>Add New User</h2>
      <form onSubmit={handleAddUser}>
        <input 
          type="text" 
          placeholder="Name" 
          value={newUser.name} 
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newUser.email} 
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
        />
        <input 
          type="tel" 
          placeholder="Phone" 
          value={newUser.phone} 
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} 
        />
        <button type="submit">Add User</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <span>{user.name} - {user.email} - {user.phone}</span>
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
       {/* 新增一個按鈕，來從外部API拉取資料並儲存 */}
       <button onClick={fetchAndSaveUsers}>Fetch and Save Users from API</button>
    </div>
  );
}

export default App;