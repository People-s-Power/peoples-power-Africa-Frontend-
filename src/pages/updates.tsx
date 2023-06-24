import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import axios from "axios";
import { Loader } from "rsuite";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const updates = () => {
    const router = useRouter()
    const { query } = useRouter();
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        axios.post('/campaign/update', {
            body: body,
            campaignId: query?.page?.slice(0, 24),
        })
            .then(function (response) {
                console.log(response);
                toast.success("Updates added successfully");
                router.push(`/mycamp`)
                // setLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false)
                toast.warn("Oops an error occurred!!");
            });
    }
    return <div>
        <div className="w-2/3 mx-auto  text-center">
            <div className="text-5xl p-10">Post Update on your Campaign</div>
            <div className="mt-4">
                <textarea onChange={(e) => setBody(e.target.value)} name="" placeholder="Post Update on your Campaign" className={'w-full rounded-md h-40'}></textarea>
                <button className="bg-warning p-2 mt-1 w-32 rounded-md" disabled={loading}
                    onClick={handleSubmit}>{loading ? <Loader content="Processing" /> : "Send"} </button>
            </div>
        </div>
        <ToastContainer />

    </div>;
}

export default updates;