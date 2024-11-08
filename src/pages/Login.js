import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../api';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  Heading,
  Text,
} from '@chakra-ui/react';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const [apiError, setApiError] = React.useState('');

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/login', data); // Adjust the endpoint as needed
      dispatch(login(response.data));
      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Box className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Heading as="h2" size="lg" mb="6" textAlign="center">
          Admin Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <Input placeholder="Email" {...register('email')} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password} mt={4}>
            <Input type="password" placeholder="Password" {...register('password')} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          {apiError && <Text color="red.500" mt={2}>{apiError}</Text>}
          <Button type="submit" colorScheme="blue" w="full" mt={6}>
            Login
          </Button>

          <Box mt={4} textAlign="center">
             <Link to="/forgot-password">Forgot Password?</Link>
          </Box>
          {role==='admin' && <Box mt={4} textAlign="center">
            You didn't have account? <Link to="/signup">Create Account</Link> 
          </Box>}
        </form>
      </Box>
    </Box>
  );
};

export default Login;
