import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', mobileNo: '', role: '' });
  const { token, logout, user } = useAuth();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5050/users/getAll', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.User);
        } else {
          setError('Failed to fetch users');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  //  Edit handler
  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit._id);
    setEditForm({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      mobileNo: userToEdit.mobileNo,
      role: userToEdit.role,
    });
  };

  // Save edit
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5050/users/updateUser/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map((u) => (u._id === editingUser ? updatedUser.user : u)));
        setEditingUser(null);
        setEditForm({ firstName: '', lastName: '', email: '', mobileNo: '', role: '' });
        alert('User updated successfully');
      } else {
        alert('Failed to update user');
      }
    } catch {
      alert('Network error');
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ firstName: '', lastName: '', email: '', mobileNo: '', role: '' });
  };

  //  Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        const res = await fetch(`http://localhost:5050/users/deleteUser/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setUsers(users.filter((user) => user._id !== id));
        } else {
          alert('Failed to delete user');
        }
      } catch {
        alert('Network error');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Users</h2>
      <button onClick={logout} style={{ ...styles.btn, backgroundColor: "#6c757d", marginBottom: "20px" }}>Logout</button>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((userItem) => (
            <tr key={userItem._id} style={styles.row}>
              <td>{userItem._id}</td>
              <td>
                {editingUser === userItem._id ? (
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  userItem.firstName
                )} {editingUser === userItem._id ? (
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  userItem.lastName
                )}
              </td>
              <td>
                {editingUser === userItem._id ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  userItem.email
                )}
              </td>
              <td>
                {editingUser === userItem._id ? (
                  <>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      style={styles.select}
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={handleSaveEdit} style={{ ...styles.btn, backgroundColor: "#28a745" }}>Save</button>
                    <button onClick={handleCancelEdit} style={{ ...styles.btn, backgroundColor: "#6c757d" }}>Cancel</button>
                  </>
                ) : (
                  <>
                    {user && (user.role === 'admin' || user.role === 'manager') && (
                      <button
                        style={{ ...styles.btn, backgroundColor: "#007bff" }}
                        onClick={() => handleEdit(userItem)}
                      >
                        Edit
                      </button>
                    )}
                    {user && user.role === 'admin' && (
                      <button
                        style={{ ...styles.btn, backgroundColor: "#dc3545" }}
                        onClick={() => handleDelete(userItem._id)}
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


//  Simple CSS styles


const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
  },
  nav: {
    marginBottom: "20px",
  },
  navLink: {
    display: "inline-block",
    margin: "0 10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  headerRow: {
    backgroundColor: "#f4f4f4",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
  btn: {
    color: "#fff",
    padding: "8px 12px",
    margin: "0 5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  input: {
    padding: "4px",
    margin: "0 2px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    width: "80px",
  },
  select: {
    padding: "4px",
    margin: "0 2px",
    border: "1px solid #ccc",
    borderRadius: "3px",
  },
};

export default HomePage;