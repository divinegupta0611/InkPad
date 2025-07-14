// src/pages/Room.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const Room = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  // Test API connectivity
  const testConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await axios.get(`${API_BASE_URL}/api/test`, {
        timeout: 5000
      });
      console.log('API test successful:', response.data);
      setDebugInfo('✅ API connection successful');
      return true;
    } catch (error) {
      console.error('API test failed:', error);
      setDebugInfo('❌ API connection failed: ' + error.message);
      return false;
    }
  };
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setConnectionStatus('Connected');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnectionStatus('Disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus('Connection Failed');
    });

    // Test API connection on component mount
    testConnection();

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const joinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      setError('Username and Room ID are required.');
      return;
    }

    if (!socket || !socket.connected) {
      setError('Socket connection not established. Please refresh the page.');
      return;
    }

    setError('');
    setLoading(true);

    // Set up event listeners before emitting
    socket.once('room-joined', (data) => {
      console.log('Successfully joined room:', data.room);
      setLoading(false);
      navigate(`/canvas/${roomId}`, {
        state: { 
          room: data.room, 
          userId: data.userId,
          username: username 
        }
      });
    });

    socket.once('error', (msg) => {
      console.error('Socket error:', msg);
      setError(msg);
      setLoading(false);
    });

    // Emit join room event
    socket.emit('join-room', { roomId: roomId.trim(), username: username.trim() });
  };

  const createRoom = async () => {
    if (!username.trim()) {
      setError('Enter a username to create room.');
      return;
    }

    if (!socket || !socket.connected) {
      setError('Socket connection not established. Please refresh the page.');
      return;
    }

    setError('');
    setLoading(true);
    setDebugInfo('Starting room creation...');

    try {
      console.log('Creating room for username:', username);
      console.log('Making POST request to:', `${API_BASE_URL}/api/rooms/create`);
      
      setDebugInfo('🔄 Sending POST request...');
      
      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/api/rooms/create`,
        data: {
          name: `Room by ${username}`
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);

      setDebugInfo('✅ POST request successful');

      if (!response.data.roomId) {
        throw new Error('Invalid response from server - no roomId received');
      }

      const newRoomId = response.data.roomId;
      
      console.log('New Room Created with ID:', newRoomId);
      setDebugInfo(`✅ Room created: ${newRoomId}`);
      
      setRoomId(newRoomId);

      // Set up event listeners before emitting
      socket.once('room-joined', (data) => {
        console.log('Successfully joined newly created room:', data.room);
        setLoading(false);
        navigate(`/canvas/${newRoomId}`, {
          state: { 
            room: data.room, 
            userId: data.userId,
            username: username 
          }
        });
      });

      socket.once('error', (msg) => {
        console.error('Socket error:', msg);
        setError(`Failed to join room: ${msg}`);
        setLoading(false);
      });

      // Join the newly created room
      setDebugInfo('🔄 Joining room via socket...');
      socket.emit('join-room', { roomId: newRoomId, username: username.trim() });

    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Error response:', err.response);
      
      setLoading(false);
      
      let errorMessage = 'Unknown error occurred';
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on port 5000.';
        setDebugInfo('❌ Connection refused - server not reachable');
      } else if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
        errorMessage = `Server error: ${err.response.status} - ${err.response.data.error || err.response.statusText}`;
        setDebugInfo(`❌ Server error: ${err.response.status}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Check if the server is running and accessible.';
        setDebugInfo('❌ No response from server');
      } else {
        console.error('Error message:', err.message);
        errorMessage = `Error: ${err.message}`;
        setDebugInfo(`❌ Error: ${err.message}`);
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Join or Create a Whiteboard Room</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Your Name:
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ 
            padding: '0.75rem', 
            width: '100%', 
            maxWidth: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Room ID:
        </label>
        <input
          type="text"
          placeholder="Enter Room ID to join existing room"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ 
            padding: '0.75rem', 
            width: '100%', 
            maxWidth: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button 
          onClick={joinRoom}
          disabled={loading || !socket || !socket.connected}
          style={{ 
            padding: '0.75rem 1.5rem', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || !socket || !socket.connected) ? 'not-allowed' : 'pointer',
            opacity: (loading || !socket || !socket.connected) ? 0.6 : 1,
            fontSize: '16px'
          }}
        >
          {loading ? 'Joining...' : 'Join Room'}
        </button>
        <button 
          onClick={createRoom}
          disabled={loading || !socket || !socket.connected}
          style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || !socket || !socket.connected) ? 'not-allowed' : 'pointer',
            opacity: (loading || !socket || !socket.connected) ? 0.6 : 1,
            fontSize: '16px'
          }}
        >
          {loading ? 'Creating...' : 'Create New Room'}
        </button>
      </div>

      {roomId && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px' 
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
            Room ID: <span style={{ fontFamily: 'monospace', color: '#007bff' }}>{roomId}</span>
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Share this ID with others to let them join your room
          </p>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {debugInfo && (
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          Debug: {debugInfo}
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
          Connection Status: 
          <span style={{ 
            color: connectionStatus === 'Connected' ? '#28a745' : '#dc3545',
            marginLeft: '0.5rem'
          }}>
            {connectionStatus}
          </span>
        </p>
        <p style={{ margin: 0, color: '#666' }}>
          Server: {API_BASE_URL}
        </p>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Debug Actions:</p>
        <button 
          onClick={testConnection}
          style={{ 
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test API Connection
        </button>
        <button 
          onClick={() => window.open(`${API_BASE_URL}/api`, '_blank')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Open API in Browser
        </button>
      </div>
    </div>
  );
};

export default Room;