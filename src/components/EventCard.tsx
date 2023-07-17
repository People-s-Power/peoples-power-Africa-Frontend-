/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Dropdown, Modal } from 'rsuite';
import { INTERESTED } from "apollo/queries/eventQuery";
import { SERVER_URL } from "utils/constants";
import { print } from 'graphql';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilValue } from "recoil";
import { UserAtom } from "atoms/UserAtom";
import { apollo } from "apollo";
import ImageCarousel from './ImageCarousel';
import Link from 'next/link';

const EventCard = ({ event }: { event: any }): JSX.Element => {
    const author = useRecoilValue(UserAtom);
    const [open, setOpen] = useState(false)
    const handelClick = () => setOpen(!open)
    const [interestedIn, setInterested] = useState(event.interested);

    const interested = async (event: any) => {
        try {
            const { data } = await axios.post(SERVER_URL + '/graphql', {
                query: print(INTERESTED),
                variables: {
                    eventId: event._id,
                    authorId: author.id,
                    authorImg: author.image,
                    name: author.name,
                    email: author.email
                }
            })
            console.log(data)
            toast.success("Registered successfully")
        } catch (error) {
            console.log(error);
            toast.warn("Oops an error occoured!")
        }
    }

    return (
        <div className='lg:w-[48%] my-4'>
            <div className="flex justify-between my-3">
                <div className='flex'>
                    <img className="w-12 h-12 rounded-full" src={event.author.image} alt="" />
                    <div className="ml-2">
                        <div className="text-base">{event.author.name} <span className="text-xs"> created this event</span></div>
                        <div className="text-xs">Following</div>
                    </div>
                </div>
            </div>
            <div className=' rounded-md shadow-sm'>
                <ImageCarousel image={event.asset} />
                <div className='my-auto w-full p-4' >
                    <div className='text-xl my-3'>{event.name}</div>
                    <div className='text-sm'>
                        {event.startDate} {event.time}
                    </div>
                    <div className='text-sm'>{event.type}</div>

                    {event.interested.length >= 2 ? <div className="flex my-6">
                        <div className="flex">
                            {event.interested.slice(0, 2).map((item, index) => (
                                <img key={index} src={item.image} className="rounded-full w-10 h-10" alt="" />
                            ))}
                        </div>
                        <div className="text-sm ml-2">
                            {event.interested[0]?.name} and {event.interested?.length} others are attending
                        </div>
                    </div> : null}

                    <div className="flex sm:mb-2">
                        {
                            event.author._id === author.id ?
                                <button onClick={() => handelClick()} className="bg-transparent text-sm flex justify-between w-44 my-4">View all attendees <img className="my-auto w-6 h-2" src="/images/btn-arrow.png" alt="" /></button> : <button onClick={() => interested(event)} className="p-3 bg-warning text-white w-72 rounded-md mr-8">
                                    Interested
                                </button>
                        }

                    </div>
                    
                    {/* 
                    <div className='flex justify-between'>
                        <button onClick={() => interested(event)} className='p-3 bg-warning text-white w-72 rounded-md'>Interested</button>
                        <Dropdown title={<img className='' src="/images/edit.svg" alt="" />} noCaret>
                            <Dropdown.Item>Promote</Dropdown.Item>
                            <Dropdown.Item>Report post</Dropdown.Item>
                            {event.author.id === author.id ? <Dropdown.Item>Edit</Dropdown.Item> : null}
                            <Dropdown.Item>Save</Dropdown.Item>
                        </Dropdown>
                    </div> */}

                </div>
            </div>
            <ToastContainer />
            <Modal open={open} onClose={handelClick}>
                <Modal.Header>
                    <Modal.Title>View list of all attendees </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-2">
                        <input type="text" onChange={(e) => { }} className="p-3 lg:w-96 w-full rounded-full  pl-10 mb-4 text-sm" placeholder="Search" />
                        {
                            interestedIn.length > 0 ?
                                interestedIn.map((item, index) => (
                                    <div key={index} className='lg:flex w-full my-3 justify-between'>
                                        <div className="flex">
                                            <img src={item.image} className='rounded-full sm:my-auto w-20 h-20' alt="" />
                                            <div className='my-auto ml-5'>
                                                <p className='lg:text-base text-sm'>{item.name}</p>
                                                <p className='lg:text-sm text-xs'>{item.email}</p>
                                            </div>
                                        </div>
                                        <Link href={`/messages?page=${item._id}`}>
                                            <button className='lg:float-right p-2 sm:my-3 rounded-full h-10 lg:my-auto text-warning border border-warning w-44'>Send Reminder</button>
                                        </Link>
                                    </div>
                                ))
                                : <p className='text-center p-4 text-base'>No one has shown interest in this event yet</p>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EventCard;