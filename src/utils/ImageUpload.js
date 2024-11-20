import { EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, Image, Input, useDisclosure } from "@chakra-ui/react";

const ImageUpload=({previewImage,handleImageChange})=>{
    const { isOpen, onOpen, onClose } = useDisclosure();
    return <Box position="relative" w="150px" h="150px" mx="auto" mb="2">
    <Image
      src={previewImage || "https://via.placeholder.com/150"}
      alt="Avatar"
      borderRadius="full"
      boxSize="150px"
      objectFit="cover"
      border="2px solid #ccc"
    />
    <IconButton
      icon={<EditIcon />}
      position="absolute"
      top={2}
      right={2}
      size="sm"
      bg="white"
      aria-label="Edit Avatar"
      onClick={onOpen}
      _hover={{ bg: "gray.100" }}
    />
    <Input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      position="absolute"
      top={0}
      left={0}
      opacity={0}
      width="100%"
      height="100%"
      cursor="pointer"
    />
  </Box>
}

export default ImageUpload;