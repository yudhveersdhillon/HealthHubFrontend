import React, { useState } from 'react';
import { 
    Box, Flex, Text, IconButton, useDisclosure,Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider
 } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Confirm from './modals/confirm';

const Layout = ({children}) => {
  const user = useSelector((state) => state.auth.user);
    const dispatch=useDispatch();
    const navigate=useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuList=[
    {label:'Dashboard',path:'/'},
    {label:'Manage Doctors',path:'/doctors'},
    {label:'Manage Staff',path:'/staff'},
    {label:' Account Settings',path:'/profile'},
    {label:'Logout',path:''},
  ]
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isOpenLogout, setIsOpen] = useState(false);
  const onCloseLogout = () => setIsOpen(false);
  const onLogout = () => {
    onClose();
    dispatch(logout());
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
          Healthhub
        </Text>
        <Menu>
            <MenuButton>
            <Avatar
                size="sm"
                name={user?.name}
                src={user?.profileImage || "https://bit.ly/dan-abramov"} 
                cursor="pointer"
            />
            </MenuButton>
            <MenuList color="black">
            <MenuItem onClick={() => navigate('/profile')}>
                Account Settings
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() =>setIsOpen(true)}>Logout</MenuItem>
            </MenuList>
        </Menu>
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
        <Flex direction="column" h="full" sx={{marginTop: '64px',overflow:'auto'}}>
          {menuList.map((item,index)=><Link key={index} to={item?.path===''?'javascript:void(0)':item?.path} className={window.location.pathname===item?.path?'active':''} onClick={()=>item?.path==='' && setIsOpen(true)} target='_self'>
            <Text py={2} px={4}>
              {item?.label}
            </Text>
          </Link>)}
          {isOpenLogout && <Confirm
             isOpen={isOpenLogout} 
             title="Confirm Logout" 
             description="Are you sure you want to logout? You will need to sign in again to access your account." 
              btnName="Logout"
              color="red" 
              onClose={onCloseLogout}
              onOk={onLogout}
            />}
        </Flex>
      </Box>

      {/* Main Content */}
      <Box
        ml={{ base: 0, md: '250px' }}
        mt="80px"
        p={4}
        bg="gray.100"
        minHeight="80vh"
      >
        {children}
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
        <Text fontSize="sm">© 2024 Healthhub</Text>
      </Box>
    </Box>
  );
};

export default Layout;
