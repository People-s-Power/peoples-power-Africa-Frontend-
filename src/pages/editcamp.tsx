import { UserAtom } from "atoms/UserAtom";
import axios from "axios";
// import LoginModal from "components/auth/login/modal/LoginModal";
// import Previewcomp from "components/Previewcomp";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ReactMde from "react-mde";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";
import Router from 'next/router'
// import PromoteComp from "./PromoteComp";
// import ShareChampaign from "./ShareChampaign";

import { useQuery } from "@apollo/client";
import { GET_CAMPAIGN } from "apollo/queries/campaignQuery";
import { apollo } from "apollo";
import Link from "next/link";

interface IFile {
    file: string;
    type: string;
    name: string;
}

const AddCampaign = ({ category }: { category: string }): JSX.Element => {
    const [campaignData, setCampaignData] = useState<ICampaign>();
    const [show, setShow] = useState(false);
    const user = useRecoilValue(UserAtom);
    const uploadRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { query } = useRouter();

    // const [campaigns, setCampaign] = useState<ICampaign[]>([]);
    const [camp, setCamp] = useState<Partial<ICampaign>>({
        id: "",
        title: "",
        aim: "",
        target: "",
        body: "",
        // author: {
        //     country: "",
        //     email: "",
        //     firstName: "",
        //     id: "",
        //     lastName: "",
        //     phone: ""
        // }
    });
    const [filePreview, setFilePreview] = useState<IFile>({
        type: "image",
        file: "",
        name: "",
    });

    useQuery(GET_CAMPAIGN, {
        client: apollo,
        variables: { slug: query.page },
        onCompleted: (data) => {
            console.log(data.getCampaign);
            setCamp({
                id: data.getCampaign.id,
                title: data.getCampaign.title,
                aim: data.getCampaign.aim,
                target: data.getCampaign.target,
                body: data.getCampaign.body,
                // author: {
                //     country: data.getCampaign.author.country,
                //     email: data.getCampaign.email,
                //     firstName: data.getCampaign.firstName,
                //     id: data.getCampaign.id,
                //     lastName: data.getCampaign.lastName,
                //     phone: data.getCampaign.phone
                // }
            })
            setFilePreview({
                type: "image",
                file: data.getCampaign.image,
                name: data.getCampaign.picture,
            })
            setLoading(true)

        },
        onError: (err) => console.log(err),
    });


    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const reader = new FileReader();

        if (files && files.length > 0) {
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                if (reader.result) {
                    let type = files[0].name.substr(files[0].name.length - 3)
                    console.log(type)
                    setFilePreview({
                        type: type === "mp4" ? "video" : "image",
                        file: reader.result as string,
                        name: files[0].name,
                    });
                }
            };
        }
    };

    // const handleNext = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!filePreview) {
    //         alert("Image upload is empty");
    //         return false;
    //     }

    //     localStorage.setItem("filePreview", JSON.stringify(filePreview));
    //     const payload = {
    //         ...camp,
    //         category,
    //     };
    //     localStorage.setItem("camp", JSON.stringify(payload));
    //     router.push(`/startcamp?category=${query.category}&&step=preview`);
    // };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        // if (!user) {
        //     return setShow(true);
        // }
        try {
            setLoading(true);
            const { data } = await axios.put("/campaign", {
                ...camp,
                category,
                image: filePreview.type === "image" ? filePreview.file : "",
            });
            setCampaignData(data);
            setLoading(false);
            // localStorage.clear();
            router.push(`/mycamp`);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    return (
        <Wrapper>
            <main>
                {loading ? (
                    <div className="upload-container py-5 position-relative">
                        <div className="container upload">
                            <form className="py-5" onSubmit={handleSubmit}>
                                <div className="text-area mb-4">
                                    <input
                                        className="form-control border-green"
                                        placeholder="Title of Campaign"
                                        onChange={(e) =>
                                            setCamp({
                                                ...camp,
                                                title: e.target.value,
                                            })
                                        }
                                        required
                                        value={camp.title}
                                    />
                                </div>

                                <div className="upload-pic flex-column d-flex align-items-center  justify-content-center border-green mb-4">
                                    {filePreview?.type === "image" && (
                                        <img src={filePreview.file} width="500" />
                                    )}
                                    {filePreview?.type === "video" && (
                                        <video
                                            src={filePreview.file}
                                            width="500"
                                            controls={true}
                                            className="embed-responsive-item"
                                        >
                                            <source src={filePreview.file} type="video/mp4" />
                                        </video>
                                    )}
                                    <div className="_upload-pic">
                                        {!filePreview?.file && (
                                            <div className="upload-icon d-flex justify-content-center mb-4">
                                                <i className=" fas fa-cloud-upload-alt fa-9x"></i>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={uploadRef}
                                            className="d-none"
                                            onChange={handleImage}
                                        />
                                        <button
                                            className="_upload-pic-btn btn text-light my-4"
                                            onClick={() => uploadRef.current?.click()}
                                            type="button"
                                        >
                                            {filePreview?.name || "Upload Image"}
                                        </button>
                                    </div>
                                </div>

                                <div className="aim mb-4 ">
                                    <textarea
                                        className="form-control border-green"
                                        placeholder="What is the Aim of this Campaign"
                                        onChange={(e) =>
                                            setCamp({
                                                ...camp,
                                                aim: e.target.value,
                                            })
                                        }
                                        required
                                        value={camp.aim}
                                    ></textarea>
                                </div>
                                <div className="target mb-4">
                                    <textarea
                                        placeholder="Who are you addressing this campaign to ? (e.g. Commissioner of Police Rivers) "
                                        className="form-control border-green"
                                        onChange={(e) =>
                                            setCamp({
                                                ...camp,
                                                target: e.target.value,
                                            })
                                        }
                                        required
                                        value={camp.target}
                                    ></textarea>
                                </div>
                                <div className="body mb-4 border-green">
                                    <ReactMde
                                        value={camp.body}
                                        toolbarCommands={[]}
                                        toolbarButtonComponent={[]}
                                        onChange={(e) =>
                                            setCamp({
                                                ...camp,
                                                body: e,
                                            })
                                        }
                                    />
                                </div>
                                <div className="btn-holder d-flex justify-content-end">
                                    {/* <button
										type="reset"
										className="btn btn-outline-warning px-4 py-2 me-2"
									>
										Save as draft
									</button> */}

                                    <button
                                        type="submit"
                                        className="btn ml-4 btn-warning text-light px-4 py-2 font-weight-bold"
                                    >
                                        Update Campaign
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="my-10 w-full text-center">
                        <img className="mx-auto" src="/images/logo.svg" alt="" />
                        <div className="my-4">
                            <div className="text-xl">Hold on while we Process your request</div>
                            <div className="text-base">Ensure your internet is stable</div>
                        </div>
                        <Link href="/mycamp">
                            <button className="px-12 bg-warning p-2 my-3 rounded-md">
                                Go back
                            </button>
                        </Link>

                    </div>
                )}

                {/* {query.step === "preview" && (
					<Previewcomp
						camp={camp as ICampaign}
						filePreview={filePreview}
						setNext={handleSubmit}
						loading={loading}
					/>
				)}
			    {query.step === "share" && <ShareChampaign />}
				{query.step === "promote" && <PromoteComp />}
				<LoginModal show={show} onHide={() => setShow(false)} />
                 */}
            </main>
        </Wrapper>
    );
};

export default AddCampaign;

const Wrapper = styled.div`
	width: 100%;
	max-width: 600px;
	margin: auto;
`;
