import React from 'react'
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

const Receivers = ({ receivers }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const btnRef = React.useRef(null)

    return (
        <>
            <Button colorScheme="blue" size="xs" ref={btnRef} onClick={onOpen}>
                Receivers
            </Button>

            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior="outside"
                size="2xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><p className='font-[Poppins] text-center text-sm border-b border-gray-400 pb-1 px-4'>
                        All Receivers of this mail</p> </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='font-[Poppins] text-blue-600 font-medium mb-4'>Total : {receivers.length}</div>
                        {
                            receivers.map((mail, index) => {
                                return (
                                    <div className='flex justify-start items-center' key={index}>
                                        <span className='font-[Poppins] text-blue-600 font-medium mr-3'>{index + 1}.</span>
                                        <span className='font-[Roboto] font-medium'>{mail}</span>
                                    </div>
                                )
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" size="sm" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Receivers