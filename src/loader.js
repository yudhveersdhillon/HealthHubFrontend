import React from "react";
import { Spinner, Flex } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(255, 255, 255, 0.8)" 
      zIndex="9999" 
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
};

export default Loader;
