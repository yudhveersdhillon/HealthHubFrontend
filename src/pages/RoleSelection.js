import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, HStack } from "@chakra-ui/react";
import { setRole } from "../store/authSlice";

const RoleSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useSelector((state) => state.auth.roles);
  const handleRoleSelection = (role) => {
    dispatch(setRole(role)); // Update the role in the Redux store
    navigate("/login"); // Redirect to the login page
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <HStack spacing={4}>
        {roles.map(role=><Button key={role} colorScheme="blue" sx={{textTransform:'capitalize'}} onClick={() => handleRoleSelection(role)}>
          {role}
        </Button>)}
      </HStack>
    </Box>
  );
};

export default RoleSelection;
