import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Input, FormControl, FormErrorMessage, Heading, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, toast } from "../../store/authSlice";

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup.string().min(6, "Minimum 6 characters").required("New password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm new password is required"),
});

const ChangePassword = () => {
  const toaster = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { status } = authState;

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(
        changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        })
      );

      if (changePassword.fulfilled.match(resultAction)) {
        toast(toaster, "Password changed successfully!", "success");
      } else {
        toast(toaster, resultAction.payload || "Password change failed", "error");
      }
    } catch (error) {
      toast(toaster, error.message || "An unexpected error occurred", "error");
    }
  };

  return (
    <Box className="w-full bg-white p-4">
        <Heading as="h2" size="lg" mb="6" textAlign="center">
          Change Password
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.oldPassword}>
            <Input type="password" placeholder="Old Password" {...register("oldPassword")} />
            <FormErrorMessage>{errors.oldPassword?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.newPassword} mt={4}>
            <Input type="password" placeholder="New Password" {...register("newPassword")} />
            <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmNewPassword} mt={4}>
            <Input type="password" placeholder="Confirm New Password" {...register("confirmNewPassword")} />
            <FormErrorMessage>{errors.confirmNewPassword?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="blue" w="full" mt={6} disabled={status === "loading"}>
            Change Password
          </Button>
        </form>
      </Box>
  );
};

export default ChangePassword;
