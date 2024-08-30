import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'; // Ensure you have a CSS file for custom styling

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5500/api/auth/signup', values);
      message.success('User registered successfully!');
      navigate('/'); // Redirect to the Sign In page after successful signup
    } catch (error) {
      message.error('Error registering user');
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <Card
        title="Sign Up"
        bordered={false}
        style={{ maxWidth: 400, width: '100%', margin: '0 auto', borderRadius: '8px' }}
      >
        <Form name="signup" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span>Already have an account? </span>
          <Link to="/">Sign In</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
