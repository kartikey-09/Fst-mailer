import React, { useState } from 'react'
import {
    Tr,
    Td,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure
} from '@chakra-ui/react';
import axios from 'axios'
import { url } from './../../api';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const User = ({ item, index, deletebtn }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const admin = useSelector((state) => state.admin);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const btnRef = React.useRef(null)

    const formatCreatedAtDate = (createdAt) => {
        const date = new Date(createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };


    function getTimeFromCreatedAt(createdAt) {
        const date = new Date(createdAt);
        const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleTimeString('en-US', options);
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${url}/api/users/update-password/${item._id}`, {
                password
            }, {
                headers: {
                    Authorization: admin.token,
                    'Content-Type': 'application/json',
                }
            })
            if (res.data.success) {
                toast.success(res.data.message);
                setPassword('');
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message)
        }
        setLoading(false);
    }
    
    return (
        <>
            <Tr className='text-sm font-[Roboto] font-medium'>
                <Td>{index + 1}</Td>
                <Td>{formatCreatedAtDate(item.createdAt)}</Td>
                <Td>{getTimeFromCreatedAt(item.createdAt)}</Td>
                <Td>{item.name}</Td>
                <Td>{item.emailId}</Td>
                {item.role !== 'Admin' ? <Td onClick={() => deletebtn(item._id)} className='cursor-pointer'>
                    <Button colorScheme="red" size="xs">
                        Delete
                    </Button>
                </Td> :
                    <Td className='cursor-pointer'>
                        <Button colorScheme="whatsapp" size="xs">
                            No Action
                        </Button>
                    </Td>
                }
                <Td>
                    <Button colorScheme="facebook" size="xs" ref={btnRef} onClick={onOpen}>
                        Update Password
                    </Button>
                </Td>
            </Tr>

            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior="outside"
                size="xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><p className='font-[Poppins] text-center text-sm border-b border-gray-400 pb-1 px-4'>
                        Update Password</p> </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={updatePassword}>
                            <input type="text" value={password} required={true}
                                className='bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700'
                                onChange={e => setPassword(e.target.value)} placeholder='Enter new password' />
                            <Button colorScheme="facebook" size="sm" className='mt-4' type='submit' isLoading={loading} isDisabled={loading}>
                                Update
                            </Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default User