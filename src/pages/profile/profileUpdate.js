import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box, 
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  Heading,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Select,
  FormLabel,
  useToast,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast, updateProfile } from "../../store/authSlice";
import ImageUpload from "../../utils/ImageUpload";
const {REACT_APP_ASSET_URL}=process.env;
// Schema for validation
const profileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  contactNumber: yup.string().nullable(),
  email: yup.string().email("Invalid email").required("Email is required"),
  website: yup.string().url("Invalid URL").nullable(),
  totalBeds: yup.number().nullable().typeError("Must be a number"),
  departments: yup.array().min(1, "Select at least one department").nullable(),
  status: yup.number().required("Status is required"),
  profileImage: yup
    .mixed()
    .test(
      "fileSize",
      "File size should be less than 2MB",
      (file) => !file || file.size <= 2 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only JPG, PNG, or GIF images are allowed",
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type)
    ),
});

const departmentsOptions = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Oncology",
];

const ProfileUpdate = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || null,
      address: user?.address || null,
      contactNumber: user?.contactNumber!=='null'?user?.contactNumber:null,
      email: user?.email || null,
      website: user?.website!=='null'?user?.website:null,
      totalBeds: user?.totalBeds || null,
      departments: user?.departments || [],
      status: user?.status || 0,
      profileImage: user?.profileImage || null,
    },
  });
  const dispatch = useDispatch();
  const toaster = useToast();
  const [previewImage, setPreviewImage] = useState(user?.profileImage?`${REACT_APP_ASSET_URL+user?.profileImage}`:null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("profileImage", file); 
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "departments") {
        data[key].forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
    try {
      const response = await dispatch(updateProfile(formData));
      if (response.meta.requestStatus === "fulfilled") {
        toast(toaster,"Your profile has been updated successfully.", "success");
      } else {
        toast(toaster,response.error.message || "Failed to update profile.","error");
      }
    } catch (error) {
      toast(toaster,error.message || "An unexpected error occurred.",'error');
    }
  };

  return (
    <Box className="w-full bg-white p-4 mb-2">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Update Profile
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ImageUpload previewImage={previewImage} handleImageChange={handleImageChange}/>
        {errors.profileImage && <Text color="red.500">{errors.profileImage.message}</Text>}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" {...register("name")} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>


          <FormControl isInvalid={errors.contactNumber}>
            <FormLabel>Contact Number</FormLabel>
            <Input placeholder="Contact Number" {...register("contactNumber")} />
            <FormErrorMessage>{errors.contactNumber?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Email" {...register("email")} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.website}>
            <FormLabel>Website</FormLabel>
            <Input placeholder="Website" {...register("website")} />
            <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.address}>
            <FormLabel>Address</FormLabel>
            <Textarea placeholder="Address" {...register("address")} />
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.departments} mt={4}>
            <FormLabel>Departments</FormLabel>
            <CheckboxGroup>
              {departmentsOptions.map((dept) => (
                <Checkbox
                  key={dept}
                  value={dept}
                  paddingRight="4"
                  {...register("departments")}
                >
                  {dept}
                </Checkbox>
              ))}
            </CheckboxGroup>
            <FormErrorMessage>{errors.departments?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.totalBeds}>
            <FormLabel>Total Beds</FormLabel>
            <Input type="number" placeholder="Total Beds" {...register("totalBeds")} />
            <FormErrorMessage>{errors.totalBeds?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.status}>
            <FormLabel>Status</FormLabel>
            <Select placeholder="Select Status" {...register("status")} disabled>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </Select>
            <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <Button type="submit" colorScheme="blue" w="full" mt={6}>
          Update Profile
        </Button>
      </form>
    </Box>
  );
};

export default ProfileUpdate;
