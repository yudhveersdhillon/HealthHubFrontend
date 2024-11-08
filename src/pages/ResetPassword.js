import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const resetPasswordSchema = yup.object().shape({
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Assuming the token is provided in the URL as a query parameter
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });
  const [apiMessage, setApiMessage] = React.useState('');

  const onSubmit = async (data) => {
    try {
      await api.post('/reset-password', {
        token,
        password: data.password,
      });
      setApiMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Box className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Heading as="h2" size="lg" mb="6" textAlign="center">
          Reset Password
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.password}>
            <Input type="password" placeholder="New Password" {...register('password')} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword} mt={4}>
            <Input type="password" placeholder="Confirm New Password" {...register('confirmPassword')} />
            <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
          </FormControl>

          {apiMessage && <Text color={apiMessage.includes('successful') ? 'green.500' : 'red.500'} mt={2}>{apiMessage}</Text>}

          <Button type="submit" colorScheme="blue" w="full" mt={6}>
            Reset Password
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
