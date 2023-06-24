import React, { useState } from 'react';
import FrontLayout from "layout/FrontLayout";
import EventCard from 'components/EventCard';
import { GET_EVENTS } from "apollo/queries/eventQuery";

import { apollo } from "apollo";
import { useQuery } from "@apollo/client";
const events = () => {
    const [events, setEvents] = useState([])
    useQuery(GET_EVENTS, {
        client: apollo,
        onCompleted: (data) => {
            console.log(data)
            setEvents(data.events)
        },
        onError: (err) => console.log(err),
    });

    return (
        <FrontLayout showFooter={false}>
            <div className="lg:mx-20 sm:mx-6">
                <div className="flex sm:flex-wrap">
                    <div className='text-lg my-auto'>Discover Events</div>
                    <div className='mx-6'>
                        <input type="date" placeholder='Date' className='rounded-md' />
                    </div>
                    <div className="flex my-auto justify-between lg:w-32 sm:mt-3 sm:w-1/2">
                        <div className='border-b-2 cursor-pointer border-warning'>Top</div>
                        <div className='cursor-pointer'>Recent</div>
                    </div>
                </div>
                <div className='my-8 flex flex-wrap justify-between p-4'>
                    {events.map((event, index) => (
                        <EventCard event={event} key={index} />
                    ))}
                    {/* <EventCard />
                    <EventCard /> */}
                </div>
            </div>
        </FrontLayout>
    );
};

export default events;