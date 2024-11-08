import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../api';
import { Box, Button, Input, FormControl, FormErrorMessage, Heading, Text } from '@chakra-ui/react';

const signupSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });
  const [apiError, setApiError] = React.useState('');

  const onSubmit = async (data) => {
    try {
      await api.post('/signup', { email: data.email, password: data.password });
      navigate('/login');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Box className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Heading as="h2" size="lg" mb="6" textAlign="center">
          Create Account
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

          <FormControl isInvalid={errors.confirmPassword} mt={4}>
            <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
            <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
          </FormControl>

          {apiError && <Text color="red.500" mt={2}>{apiError}</Text>}

          <Button type="submit" colorScheme="blue" w="full" mt={6}>
            Sign Up
          </Button>

          <Box mt={4} textAlign="center">
            <Link to="/login">Already have an account? Login</Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
