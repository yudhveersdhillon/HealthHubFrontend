import React, { useState } from 'react';
import { Box, Flex, Text, IconButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box>
      {/* Header */}
      <Flex
        as="header"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="10"
        bg="blue.600"
        color="white"
        p={4}
        justify="space-between"
        align="center"
      >
        <IconButton
          icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={toggleSidebar}
          display={{ base: 'block', md: 'none' }}
        />
        <Text fontSize="xl" fontWeight="bold">
          Dashboard
        </Text>
        <Box> {/* Add any other header content like user profile here */}</Box>
      </Flex>

      {/* Sidebar */}
      <Box
        as="aside"
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        width={{ base: '60%', md: '250px' }}
        bg="blue.800"
        color="white"
        display={{ base: isSidebarOpen ? 'block' : 'none', md: 'block' }}
        p={4}
        transition="0.3s"
        zIndex="5"
      >
        <Flex direction="column" h="full">
          <Link to="/profile">
            <Text py={2} _hover={{ bg: 'blue.700' }} px={4}>
              Profile
            </Text>
          </Link>
          <Link to="/settings">
            <Text py={2} _hover={{ bg: 'blue.700' }} px={4}>
              Settings
            </Text>
          </Link>
          {/* Add more links here */}
        </Flex>
      </Box>

      {/* Main Content */}
      <Box
        ml={{ base: 0, md: '250px' }}
        mt="80px"
        p={4}
        bg="gray.100"
        minHeight="100vh"
      >
        <Text fontSize="2xl">Welcome to the Dashboard</Text>
        {/* Add more content here */}
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="blue.600"
        color="white"
        p={4}
        textAlign="center"
      >
        <Text fontSize="sm">© 2024 Hospital Management System</Text>
      </Box>
    </Box>
  );
};

export default Dashboard;
