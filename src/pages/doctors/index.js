import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  fetchDoctors,
  registerDoctor,
  updateDoctor,
  deleteDoctor,
} from '../../store/doctorSlice';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Text,
  Spinner,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Select,
  FormErrorMessage,
  Avatar,
} from '@chakra-ui/react';
import { toast } from '../../store/authSlice';
import ImageUpload from '../../utils/ImageUpload';
import Confirm from '../../modals/confirm';
import Pagination from '../../utils/pagination';
import ListHeader from '../../utils/ListHeader';
const {REACT_APP_ASSET_URL}=process.env;
// Validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  specialty: Yup.string().optional(),
  licenseNumber: Yup.string().required('License number is required'),
  yearsOfExperience: Yup.number().required('Years of experience is required').positive(),
  hospital: Yup.string().required('Hospital is required'),
  profileImage: Yup.mixed()
    .test('fileSize', 'File size too large', (value) => {
      if (!value?.[0]) return true; // Skip validation if no file selected
      return value[0].size <= 2000000; // 2MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value?.[0]) return true; // Skip validation if no file selected
      return ['image/jpeg', 'image/png'].includes(value[0].type);
    }),
  department: Yup.string().required('Department is required'),
  address: Yup.string().required('Address is required'),
  password: Yup.string().required('Password is required'),
  status: Yup.number().required("Status is required"),
});

const Doctors = () => {
  const dispatch = useDispatch();
  const { list: doctors, loading,total} = useSelector((state) => state.doctors);
  const toaster = useToast();
  const [page,setPage]=useState(1);
  const [limit,setLimit]=useState(10);
  const [search,setSearch]=useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isOpenDelete,setIsOpenDelete]=useState(false);
  const [delDoctor,setDelDoctor]=useState(null);
  useEffect(() => {
    dispatch(fetchDoctors({page:page,limit:limit,search:search}));
  }, [dispatch,page,limit,search]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("profileImage", file); 
    }
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });

    try {
      if (editingDoctorId) {
        await dispatch(updateDoctor({ id: editingDoctorId, formData })).unwrap();
        toast(toaster,'Doctor updated successfully.', "success");
      } else {
        await dispatch(registerDoctor(formData)).unwrap();
        toast(toaster,'Doctor registered successfully.', "success");
      }
      resetForm();
      setIsModalOpen(false); 
    } catch (err) {
      toast(toaster, err.message || 'Something went wrong.', "error");
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctorId(doctor._id);
    setValue('name', doctor.name);
    setValue('email', doctor.email);
    setValue('phone', doctor.phone);
    setValue('specialty', doctor.specialty);
    setValue('licenseNumber', doctor.licenseNumber);
    setValue('yearsOfExperience', doctor.yearsOfExperience);
    setValue('hospital', doctor.hospital);
    setValue('profileImage', doctor.profileImage); // File input can't be pre-filled, handle separately
    setValue('department', doctor.department);
    setValue('address', doctor.address);
    setValue('password', doctor.password);
    setValue('status', doctor.status);
    setPreviewImage(doctor.profileImage);
    setIsModalOpen(true); // Open modal when editing
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDoctor(id)).unwrap();
      setDelDoctor(null);
      toast(toaster,'Doctor deleted successfully.', "success");
    } catch (err) {
      toast(toaster,err.message || 'Failed to delete doctor.', "error");
    }
  };

  const resetForm = () => {
    setEditingDoctorId(null);
    reset();
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <ListHeader title="Manage Doctors" search={search} setSearch={setSearch} setIsModalOpen={setIsModalOpen}/>
      <Box>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Specialty</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={6}>
                  <Flex justify="center" align="center">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
            ) : doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Tr key={doctor._id}>
                  <Td>
                    <Avatar
                      size="sm"
                      name={doctor.name}
                      src={doctor?.profileImage?`${REACT_APP_ASSET_URL+doctor?.profileImage}` : "https://bit.ly/dan-abramov"} 
                      cursor="pointer"
                    />
                  </Td>
                  <Td>{doctor.name}</Td>
                  <Td>{doctor.email}</Td>
                  <Td>{doctor.specialty}</Td>
                  <Td>{doctor.status===1?'Active':doctor.status===2?'Deleted':'In-active'}</Td>
                  <Td>
                    <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEdit(doctor)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() =>{ setDelDoctor(doctor); setIsOpenDelete(true)} }
                    >
                      Del
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  No doctors found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Pagination total={total} page={page} limit={limit} setPage={setPage} setLimit={setLimit}/>
      </Box>
      {isOpenDelete && <Confirm
        isOpen={isOpenDelete} 
        title="Delete Doctor" 
        description="Are you sure you want to delete?" 
        btnName="Delete"
        color="red" 
        onClose={()=>{setIsOpenDelete(false);setDelDoctor(null);}}
        onOk={()=>{setIsOpenDelete(false);handleDelete(delDoctor._id);}}
      />}
      {/* Modal for editing */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ImageUpload previewImage={previewImage} handleImageChange={handleImageChange}/>
              {errors.profileImage && <Text color="red.500">{errors.profileImage.message}</Text>}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={errors.name} mb={4}>
                <FormLabel>Name</FormLabel>
                <Input {...register('name')} />
                {errors.name && <Text color="red.500">{errors.name.message}</Text>}
              </FormControl>

              <FormControl isInvalid={errors.email} mb={4}>
                <FormLabel>Email</FormLabel>
                <Input {...register('email')} />
                {errors.email && <Text color="red.500">{errors.email.message}</Text>}
              </FormControl>

              <FormControl isInvalid={errors.phone} mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input {...register('phone')} />
                {errors.phone && <Text color="red.500">{errors.phone.message}</Text>}
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Specialty</FormLabel>
                <Input {...register('specialty')} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>License Number</FormLabel>
                <Input {...register('licenseNumber')} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Years of Experience</FormLabel>
                <Input type="number" {...register('yearsOfExperience')} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Hospital</FormLabel>
                <Input {...register('hospital')} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Department</FormLabel>
                <Input {...register('department')} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Address</FormLabel>
                <Input {...register('address')} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register('password')} />
              </FormControl>
              <FormControl isInvalid={errors.status}>
                <FormLabel>Status</FormLabel>
                <Select placeholder="Select Status" {...register("status")}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                  <option value={2}>Deleted</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>
              </SimpleGrid>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button variant="ghost" onClick={() =>{resetForm();setIsModalOpen(false);}}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Doctors;
