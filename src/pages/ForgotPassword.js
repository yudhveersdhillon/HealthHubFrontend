import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../api';
import { Box, Button, Input, FormControl, FormErrorMessage, Heading, Text, useToast } from '@chakra-ui/react';
import { forgotPassword, toast } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
  const toaster=useToast();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const authState = useSelector((state) => state.auth);
  const { status } = authState;
  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(
        forgotPassword({ email: data.email })
      );

      if (forgotPassword.fulfilled.match(resultAction)) {
        toast(toaster,'Password reset link sent to your email.','success');
      } else {
        toast(toaster,resultAction.payload || 'Failed to send reset link','error');
      }
    } catch (error) {
      toast(toaster,error.message || 'Failed to send reset link',error);
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
           <Button type="submit" colorScheme="blue" w="full" mt={6} disabled={status==='loading'}>
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
