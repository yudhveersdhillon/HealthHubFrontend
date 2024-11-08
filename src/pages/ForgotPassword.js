import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../api';
import { Box, Button, Input, FormControl, FormErrorMessage, Heading, Text } from '@chakra-ui/react';

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const [apiMessage, setApiMessage] = React.useState('');

  const onSubmit = async (data) => {
    try {
      await api.post('/forgot-password', { email: data.email });
      setApiMessage('Password reset link sent to your email.');
    } catch (error) {
      setApiMessage('Failed to send reset link');
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Box className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Heading as="h2" size="lg" mb="6" textAlign="center">
          Forgot Password
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <Input placeholder="Email" {...register('email')} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {apiMessage && <Text color="green.500" mt={2}>{apiMessage}</Text>}

          <Button type="submit" colorScheme="blue" w="full" mt={6}>
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
