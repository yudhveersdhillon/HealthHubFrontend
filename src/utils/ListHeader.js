import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, IconButton } from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const ListHeader = ({ title, search, setSearch,setIsModalOpen }) => {
  return (
    <Box>
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          {title}
        </Text>

        <Box display="flex" alignItems="center">
          <InputGroup>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderRadius="md"
            />
            <InputRightElement>
              {search ? (
                <IconButton
                  size="sm"
                  icon={<CloseIcon />}
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  variant="ghost"
                />
              ) : (
                <SearchIcon color="gray.500" />
              )}
            </InputRightElement>
          </InputGroup>
          <Button colorScheme="blue" ml={4} onClick={() => setIsModalOpen(true)}>
            + Add
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default ListHeader;
