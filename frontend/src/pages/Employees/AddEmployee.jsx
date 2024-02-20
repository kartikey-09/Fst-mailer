import React from 'react'
import { useState } from 'react';
import {
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
import { AiOutlineUserAdd } from 'react-icons/ai'
import { toast } from 'react-hot-toast';
import { url } from './../../api';
import axios from 'axios';

const AddEmployee = ({ TL, admin, getEmployees }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef(null)
    const [selectedValue, setSelectedValue] = useState('');
    const [name, setName] = useState('');
    const [emailId, setEmailId] = useState([]);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSelectChange = (e) => {
        e.preventDefault();
        setSelectedValue(e.target.value)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (selectedValue.length < 5) {
            toast.error("Please Select a Team")
            setLoading(false);
            return;
        }
       
        try {
            const res = await axios.post(`${url}/api/users/create-user`, {
                name, emailId, password, role: 'Member', creator: selectedValue
            }, {
                headers: {
                    Authorization: admin.token,
                    'Content-Type': 'application/json',
                }
            });
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setName('');
                setEmailId('');
                setPassword('');
                getEmployees(selectedValue);
            }
        }
        catch (err) {
            if (err?.response?.data?.message);
            toast.error(err?.response?.data?.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        console.log({ selectedValue, name, emailId, password })
    }

    return (
        <div>
            <Button colorScheme="green" size="sm" ref={btnRef} onClick={onOpen}>
                Add Member
            </Button>

            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior="outside"
                size="3xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><p className='font-[Poppins] text-center text-sm border-b border-gray-400 pb-1 px-4'>
                        Add Member to a Team</p> </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleFormSubmit}>
                            <select value={selectedValue} onChange={handleSelectChange} className="bg-gray-50 border border-gray-300 text-gray-600  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 font-medium font-[Roboto]">
                                <option value="">Select an option</option>
                                {
                                    TL.map((tl) => {
                                        return <option value={tl._id} key={tl._id}>
                                            {tl.teamName}
                                        </option>
                                    })
                                }
                            </select>

                            <div className="mb-2 mt-5 flex items-center">
                                {/* <span className='mr-1 md:mr-2 font-[Ubuntu]'>Name</span> */}
                                <input type="text" value={name} required={true}
                                    className='bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700'
                                    onChange={e => setName(e.target.value)} placeholder="Enter Name" />
                            </div>

                            <div className=" my-2 flex items-center">
                                {/* <span className='mr-1 md:mr-2 font-[Ubuntu]'>Email</span> */}
                                <input type="email" value={emailId} required={true}
                                    className='bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700'
                                    onChange={e => setEmailId(e.target.value)} placeholder="Enter Email" />
                            </div>

                            <div className=" my-2 flex items-center">
                                {/* <span className='mr-1 md:mr-2 font-[Ubuntu]'>Password</span> */}
                                <input type="text" value={password} required={true}
                                    className='bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700'
                                    onChange={e => setPassword(e.target.value)} placeholder="Enter Password" />
                            </div>

                            <div className="mx-2 md:mx-4 my-3 flex items-center text-wrap flex-col md:flex-row">
                                <span className='ml-4 text-xs md:text-sm underline text-gray-600 font-medium font-[Roboto]'>
                                    NOTE -
                                </span>
                                <span className='ml-4 text-xs md:text-sm italic text-red-600 font-medium font-[Roboto]'>
                                    Make sure you enter the correct password of Email Id otherwise it will not work properly.
                                </span>
                            </div>

                            <div className='mx-2 md:mx-4 my-4 flex justify-center items-center'>
                                <Button colorScheme="green" size="sm" className='mt-4' type='submit' isLoading={loading} isDisabled={loading}>
                                    <AiOutlineUserAdd className='mr-1' />Create
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AddEmployee
