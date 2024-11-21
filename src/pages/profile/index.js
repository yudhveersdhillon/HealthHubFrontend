import React from "react";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ChangePassword from "./changePassord";
import ProfileUpdate from "./profileUpdate";

const Profile = () => {
  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Heading as="h1" size="lg" mb={6}>
        Account Settings
      </Heading>
      <Box
        maxW="1200px"
        borderRadius="md"
      >
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Update Profile</Tab>
            <Tab>Change Password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ProfileUpdate />
            </TabPanel>
            <TabPanel>
              <ChangePassword />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Profile;
