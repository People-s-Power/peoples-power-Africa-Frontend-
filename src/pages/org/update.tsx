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
import { UPDATE_ORG, GET_ORGANIZATION } from "apollo/queries/orgQuery";
import { print } from 'graphql';
import Select from "react-select"

const update = () => {
    const router = useRouter();
    const user = useRecoilValue(UserAtom);
    const [orgName, setOrgName] = useState('')
    const [orgEmail, setOrgEmail] = useState('')
    const [orgPhone, setOrgPhone] = useState('')
    const [orgDes, setOrgDes] = useState('')
    const [orgWeb, setOrgWeb] = useState('')
    const [orgTwitter, setOrgTwitter] = useState('')
    const [orgInsta, setOrgInsta] = useState('')
    const [orgLinkedln, setOrgLinkedln] = useState('')
    const [orgState, setOrgState] = useState('')
    const [orgCountry, setOrgCountry] = useState('')
    const [orgFacebook, setOrgFacebook] = useState('')
    const [orgCity, setOrgCity] = useState('')
    const { query } = useRouter();
    const [categoryValue, setCategoryValue] = useState("")
    const [subCategoryValue, setSubCategoryValue] = useState("")

    const category = [
        { value: "NGO", label: "Non-Governmental Organization (NGO)" },
        { value: "coaching and mentoring", label: "Coaching and mentoring" },
        { value: "health", label: "Health" },
        { value: "leadership development", label: "Leadership development" },
        { value: "law", label: "Law" },
        { value: "information technology", label: "Information technology" },
        { value: "others", label: "Others" },
    ]
    const subCategory = [
        { value: "human right awareness", label: "Human right awareness" },
        { value: "social policy", label: "Social Policy" },
        { value: "criminal justice", label: "Criminal Justice" },
        { value: "human right action", label: "Human Right Action" },
        { value: "environment", label: "Environment" },
        { value: "health", label: "Health" },
        { value: "disability", label: "Disability" },
        { value: "equality", label: "Equality" },
        { value: "others", label: "Others" },
    ]

    const [loading, setLoading] = useState(false)

    useQuery(GET_ORGANIZATION, {
        variables: { ID: query.page },
        client: apollo,
        onCompleted: (data) => {
            console.log(data.getOrganzation)
            setOrgName(data.getOrganzation.name)
            setOrgCity(data.getOrganzation.city)
            setOrgState(data.getOrganzation.state)
            setOrgCountry(data.getOrganzation.country)
            setOrgDes(data.getOrganzation.description)
            setOrgEmail(data.getOrganzation.email)
            setOrgPhone(data.getOrganzation.phone)
            setOrgFacebook(data.getOrganzation.facebook)
            setOrgTwitter(data.getOrganzation.twitter)
            setOrgInsta(data.getOrganzation.instagram)
            setOrgLinkedln(data.getOrganzation.linkedln)
            setOrgWeb(data.getOrganzation.website)
        },
        onError: (err) => console.log(err),
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(SERVER_URL + '/graphql', {
                query: print(UPDATE_ORG),
                variables: {
                    UpdateInput: {
                        orgId: query.page,
                        name: orgName,
                        email: orgEmail,
                        phone: orgPhone,
                        // description: orgDes,
                        website: orgWeb,
                        linkedIn: orgLinkedln,
                        twitter: orgTwitter,
                        facebook: orgFacebook,
                        instagram: orgInsta,
                        country: orgCountry,
                        city: orgCity,
                        state: orgState,
                        category: [categoryValue],
                        // subCategory: [subCategoryValue]
                    }
                }
            })
            console.log(data)
            setLoading(false);
            toast.success("Organization Updated Successfully!");
            router.push(`/org?page=${query.page}`);
        } catch (error) {
            console.log(error);
            toast.warn("Oops and error occoured");
            setLoading(false);
        }
    };
    return (
        <FrontLayout showFooter={false}>
            <div className="lg:w-2/3 mx-auto text-center sm:p-6 py-10">
                <div className='text-3xl font-black my-8'>Update Your Organization</div>
                <div>
                    <div className="my-2">
                        <input type="text" required className="p-3 w-full" value={orgName} placeholder="Enter Organizations Name" onChange={(e) => setOrgName(e.target.value)} />
                    </div>
                    <div className="my-2">
                        <input type="email" required className="p-3 w-full" value={orgEmail} placeholder="Enter Organizations Email" onChange={(e) => setOrgEmail(e.target.value)} />
                    </div>
                    <div className="my-2">
                        <input type="number" required className="p-3 w-full" value={orgPhone} placeholder="Enter Organizations Phone Number" onChange={(e) => setOrgPhone(e.target.value)} />
                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgWeb} placeholder="Enter Organizations Website" onChange={(e) => setOrgWeb(e.target.value)} />
                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgTwitter} placeholder="Enter Organizations Twitter" onChange={(e) => setOrgTwitter(e.target.value)} />
                    </div><div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgInsta} placeholder="Enter Organizations Instagram" onChange={(e) => setOrgInsta(e.target.value)} />

                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgFacebook} placeholder="Enter Organizations Facebook" onChange={(e) => setOrgFacebook(e.target.value)} />
                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgLinkedln} placeholder="Enter Organizations Linkedln" onChange={(e) => setOrgLinkedln(e.target.value)} />
                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgCountry} placeholder="Enter Organizations Country" onChange={(e) => setOrgCountry(e.target.value)} />
                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgState} placeholder="Enter Organizations State" onChange={(e) => setOrgState(e.target.value)} />
                    </div>
                    <div className='my-2'>
                        <input type="text" required className="p-3 w-full" value={orgCity} placeholder="Enter Organizations City" onChange={(e) => setOrgCity(e.target.value)} />
                    </div>
                    <Select
                        className="mb-4"
                        classNamePrefix="select"
                        placeholder="Select Category of Service Provider"
                        onChange={(val: any) => setCategoryValue(val.value)}
                        isClearable={true}
                        isSearchable={true}
                        name="color"
                        options={category}
                    />
                    {categoryValue === "NGO" ? (
                        <Select
                            className="mb-4"
                            classNamePrefix="select"
                            onChange={(val: any) => setSubCategoryValue(val.value)}
                            placeholder="Select Sub-Category of Service Provider"
                            isClearable={true}
                            isSearchable={true}
                            name="color"
                            options={subCategory}
                        />
                    ) : null}
                    {/* <div className="my-2">
                        <textarea required className="h-20 w-full" value={orgDes} placeholder="Enter a Short Description" onChange={(e) => setOrgDes(e.target.value)} ></textarea>
                    </div> */}
                    <div>
                        <button onClick={handleSubmit} className="p-2 btn btn-warning w-32">{loading ? <Loader content="Loading...." /> : "Update"}
                        </button>
                    </div>
                </div>
                <ToastContainer />

            </div>
        </FrontLayout>
    );
}

export default update;