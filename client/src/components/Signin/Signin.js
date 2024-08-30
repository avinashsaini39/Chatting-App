import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Layout } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import './Signin.css';
import video from './small.mp4'; // Replace with your logo import
// import logo from './logo.png';  // Path to your logo image

const { Footer } = Layout;

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5500/api/auth/signin', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', values.username);
      message.success('Logged in successfully!');
      navigate('/chatroom');
    } catch (error) {
      message.error('Error logging in');
    }
    setLoading(false);
  };

  return (
    <div className="signin-container">
      <video autoPlay muted loop playsInline className="background-video">
        <source src={video} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div className="form-overlay">
        <Card
          bordered={false}
          style={{ maxWidth: 400, width: '100%', margin: '0 auto', borderRadius: '8px' }}
        >
          {/* Logo */}
          <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* <img src={logo} alt="Logo" style={{ maxWidth: '150px', width: '100%' }} /> */}
            <p style={{ maxWidth: '150px', width: '100%' }}>Chat</p>
          </div>

          {/* Title */}
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>

          {/* Form */}
          <Form name="signin" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span>Don't have an account? </span>
            <Link to="/signup">Register</Link>
          </div>
        </Card>
      </div>
      <Footer className="signin-footer">
        © Copyright {moment().format('YYYY')} Titan Tech. All Rights Reserved.
      </Footer>
    </div>
  );
};

export default Signin;
