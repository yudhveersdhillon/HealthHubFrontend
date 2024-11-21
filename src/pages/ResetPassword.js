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
  useToast
} from '@chakra-ui/react';
import { resetPassword, toast } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const resetPasswordSchema = yup.object().shape({
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const toaster = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { status } = authState;
  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(
        resetPassword({ token, password: data.password})
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        toast(toaster,'Password reset successful! Redirecting to login...','success');
        navigate('/login');
      } else {
        toast(toaster,(resultAction.payload || 'Signup failed'),'error');
      }
    } catch (error) {
      toast(toaster,(error.message || 'An unexpected error occurred'),'error');
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

          <Button type="submit" colorScheme="blue" w="full" mt={6} disabled={status==='loading'}>
            Reset Password
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
