import React from 'react';
import { Modal, Button, } from 'rsuite';

const EventModal = ({ open, handelClick }: { open: boolean, handelClick(): void }): JSX.Element => {

    return (
        <div>
            <Modal size="full" open={open} onClose={handelClick}>
                <Modal.Header>
                    <Modal.Title>Fill Form</Modal.Title>
                </Modal.Header>
                <Modal.Body className='m-2'>
                    <div className='my-3'>
                        <div className='my-1'>Full Name</div>
                        <input type="text" className='w-full rounded-md' />
                    </div>
                    <div className='my-3'>
                        <div className='my-1'>Phone Number</div>
                        <input type="number" className='w-full rounded-md' />
                    </div>
                    <div className='my-3'>
                        <div className='my-1'>Email Address</div>
                        <input type="email" className='w-full rounded-md' />
                    </div>
                    <div className='my-3'>
                        <div className='my-1'>Home Address</div>
                        <input type="text" className='w-full rounded-md' />
                    </div>
                    <div className='my-3 flex justify-between'>
                        <div className='w-[48%]'>
                            <div className='my-1'>Country</div>
                            <input type="text" className='w-full rounded-md' />
                        </div>
                        <div className='w-[48%]'>
                            <div className='my-1'>Gender</div>
                            <input type="text" className='w-full rounded-md' />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    <Button onClick={handelClick} className="bg-warning text-white px-2">
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EventModal;