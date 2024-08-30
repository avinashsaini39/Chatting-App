import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Input, Button, Layout, Row, Col } from 'antd';
import io from 'socket.io-client';
import moment from 'moment';
import './ChatRoom.css';

const { Content } = Layout;

const socket = io('http://localhost:5500');

const ChatRoom = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      socket.emit('user connected', username);
    }

    socket.emit('get users');
    socket.on('users list', (usersList) => {
      setUsers(usersList.filter(user => user.username !== username));
    });

    socket.on('user status', (userStatus) => {
      setUsers((prevUsers) =>
        prevUsers.map(user =>
          user.username === userStatus.username ? { ...user, status: userStatus.status } : user
        )
      );
    });

    socket.on('personal chat message', (msg) => {
      if (msg.to === selectedUser || msg.username === selectedUser || msg.username === localStorage.getItem('username')) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, msg];
          localStorage.setItem(`chat_history_${selectedUser}`, JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }
    });

    socket.on('chat history', (history) => {
      setMessages(history);
    });

    return () => {
      socket.off('users list');
      socket.off('user status');
      socket.off('personal chat message');
      socket.off('chat history');
    };
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const savedHistory = localStorage.getItem(`chat_history_${selectedUser}`);
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      } else {
        socket.emit('get chat history', selectedUser);
      }
    }
  }, [selectedUser]);

  const sendMessage = () => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('Username is not found in localStorage');
      return;
    }
  
    const msg = { username, text: message, timestamp: new Date(), to: selectedUser };
  
    socket.emit('personal chat message', msg);
  
    // No need to manually add the message to the state here
    setMessage(''); // Clear the input after sending the message
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <Layout className="chatroom-layout">
      <Row>
        <Col xs={24} sm={8} md={6}>
          <Card className="chatroom-sider">
            <List
              itemLayout="horizontal"
              dataSource={users}
              renderItem={(user) => (
                <List.Item
                  className={user.username === selectedUser ? 'ant-list-item-selected' : ''}
                  onClick={() => setSelectedUser(user.username)}
                >
                  <List.Item.Meta
                    avatar={<span className={`user-badge ${user.status === 'online' ? 'user-badge-online' : 'user-badge-offline'}`} />}
                    title={user.username}
                  />
                </List.Item>
              )}
            />
            <Button
              type="danger"
              block
              onClick={handleLogout}
              style={{ marginTop: '10px' }}
            >
              Logout
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={16} md={18}>
          <Content className="chatroom-content">
            <Card className="chatroom-card">
              <div ref={chatContainerRef} className="chat-container">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${msg.username === localStorage.getItem('username') ? 'sent' : 'received'}`}
                  >
                    <strong>{msg.username}</strong>: {msg.text} <span>{moment(msg.timestamp).format('HH:mm:ss')}</span>
                  </div>
                ))}
              </div>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={sendMessage}
                placeholder="Type a message..."
              />
              <Button type="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
                Send
              </Button>
            </Card>
          </Content>
        </Col>
      </Row>
      <footer className="chatroom-footer">© {moment().year()}</footer>
    </Layout>
  );
};

export default ChatRoom;
