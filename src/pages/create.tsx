import React, { useState, useRef } from 'react';
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserAtom } from "atoms/UserAtom";
import { useRecoilValue } from "recoil";
import { SERVER_URL } from "utils/constants";
import FrontLayout from "layout/FrontLayout";
import { Loader } from "rsuite";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apollo } from "apollo";
import { useQuery } from "@apollo/client";
import { CREATE_ORG } from "apollo/queries/orgQuery";
import { print } from 'graphql';

const create = () => {
    const router = useRouter();
    const user = useRecoilValue(UserAtom);
    const [orgName, setOrgName] = useState('')
    const [orgEmail, setOrgEmail] = useState('')
    const [orgPhone, setOrgPhone] = useState('')
    const [orgDes, setOrgDes] = useState('')
    const [orgWeb, setOrgWeb] = useState('')
    const [loading, setLoading] = useState(false)


    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(SERVER_URL + '/graphql', {
                query: print(CREATE_ORG),
                variables: {
                    CreateOrgInput: { name: orgName, email: orgEmail, phone: orgPhone, description: orgDes, website: orgWeb }
                }
            })
            console.log(data)
            setLoading(false);
            toast.success("Organization Created Successfully!");
            router.push(`/user?page=${user.id}`);
        } catch (error) {
            console.log(error);
            toast.warn("Oops and error occoured");
            setLoading(false);
        }
    };
    return (
        <FrontLayout showFooter={false}>
            <div className="lg:w-2/3 sm:p-6 mx-auto text-center lg:py-10">
                <div className='text-3xl font-black my-8'>Create a New Organization</div>
                <div>
                    <div className="my-2">
                        <input type="text" required className="p-3 w-full" placeholder="Enter Organizations Name" onChange={(e) => setOrgName(e.target.value)} />
                    </div>
                    <div className="my-2">
                        <input type="email" required className="p-3 w-full" placeholder="Enter Organizations Email" onChange={(e) => setOrgEmail(e.target.value)} />
                    </div>
                    <div className="my-2">
                        <input type="number" required className="p-3 w-full" placeholder="Enter Organizations Phone Number" onChange={(e) => setOrgPhone(e.target.value)} />
                    </div>
                    <input type="text" required className="p-3 w-full" placeholder="Enter Organizations Website" onChange={(e) => setOrgWeb(e.target.value)} />

                    <div className="my-2">
                        <textarea required className="h-20 w-full" placeholder="Enter a Short Description" onChange={(e) => setOrgDes(e.target.value)} ></textarea>
                    </div>
                    <div>
                        <button onClick={handleSubmit} className="p-2 btn btn-warning w-32">{loading ? <Loader content="Loading...." /> : "Create"}
                        </button>
                    </div>
                </div>
                <ToastContainer />

            </div>
        </FrontLayout>
    );
}

export default create;