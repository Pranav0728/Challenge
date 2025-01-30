"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-toastify/dist/ReactToastify.css';
import { signOut } from 'next-auth/react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', dob: '' });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/userdata');
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
        toast.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const age = new Date().getFullYear() - new Date(newUser.dob).getFullYear();
    if (!newUser.name || !newUser.dob) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/userdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUser.name, dob: newUser.dob, age }),
      });
      const addedUser = await res.json();
      setUsers([...users, addedUser]);
      setNewUser({ name: '', dob: '' });
      toast.success('User added successfully');
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/userdata?id=${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
    if (!newUser.name || !newUser.dob) {
      toast.error('Please fill all fields');
      return;
    }
    
    const age = new Date().getFullYear() - new Date(newUser.dob).getFullYear();
    try {
      const res = await fetch('/api/userdata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingUserId, name: newUser.name, dob: newUser.dob, age }),
      });
      const updatedUser = await res.json();
      setUsers(users.map(user => (user._id === editingUserId ? updatedUser : user)));
      setEditingUserId(null);
      setNewUser({ name: '', dob: '' });
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setNewUser({ name: user.name, dob: user.dob });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to home page after logout
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-center my-5">User Management Dashboard</h1>
      
      <div className="flex flex-col items-center m-5 space-y-4">
        <div className="flex space-x-4 items-center justify-around w-full">
          <div className='flex space-x-4'>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={newUser.dob}
              onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={editingUserId ? handleUpdateUser : handleAddUser}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              {editingUserId ? 'Save Changes' : 'Add User'}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="mt-5 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full mt-5 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Age</th>
              <th className="p-3 border">Date of Birth</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center"><Skeleton count={5} height={40} /></td>
              </tr>
            ) : (!Array.isArray(users) || users.length === 0) ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500">No data available</td>
              </tr>
            ) : (
              users.map((user) => {
                const age = new Date().getFullYear() - new Date(user.dob).getFullYear();
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{age}</td>
                    <td className="p-3 border">{new Date(user.dob).toLocaleDateString()}</td>
                    <td className="p-3 border flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
