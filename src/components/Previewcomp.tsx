import router from "next/router";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ICampaign } from "types/Applicant.types";
import axios from 'axios';
import { IOrg } from "types/Applicant.types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserAtom } from "atoms/UserAtom";
import { atom } from "recoil";
import { orgDataState } from "atoms/OrgsAtom";
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery";
import { apollo } from "apollo";
import { useQuery } from "@apollo/client";
import { print } from 'graphql';
import { SERVER_URL } from "utils/constants";

interface IProps {
  camp: ICampaign;
  loading: boolean;
  filePreview: {
    type: string;
    file: string;
  };
  setNext(): void;
  setOrgNext(): void;
}
const previewcamp = ({
  camp,
  filePreview,
  setNext,
  setOrgNext,
  loading,
}: IProps): JSX.Element => {

  const [account, setAccount] = useState("")
  const [orgs, setOrgs] = useState<IOrg[]>([])
  const [org, setOrg] = useState<IOrg[]>([])
  const user = useRecoilValue(UserAtom);
  const setOrgData = useSetRecoilState(orgDataState);
  const author = useRecoilValue(UserAtom);
  const [orgId, setOrgId] = useState("")

  useQuery(GET_ORGANIZATIONS, {
    variables: { ID: user?.id },
    client: apollo,
    onCompleted: (data) => {
      // console.log(data)
      if (data.getUserOrganizations.length > 0) {
        setAccount('org')
      } else {
        setAccount("user")
      }
      setOrgs(data.getUserOrganizations)
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    try {
      axios.get(`/user/single/${author.id}`)
        .then(function (response) {
          response.data.user.orgOperating.map((operating: any) => {
            setOrgId(operating)
            refetch()
          })
        })
        .catch(function (error) {
        })
    } catch (error) {
      console.log(error);
    }
  }, [])
  const { refetch } = useQuery(GET_ORGANIZATION, {
    variables: { ID: orgId },
    client: apollo,
    onCompleted: (data) => {
      setOrgs([...orgs, data.getOrganzation])
      setAccount('org')
    },
    onError: (err) => {
      // console.log(err)
    },
  });


  const singleOrg = async (id: string) => {
    const { data } = await axios.post(SERVER_URL + '/graphql', {
      query: print(GET_ORGANIZATION),
      variables: {
        ID: id
      }
    })
    // console.log(data.data.getOrganzation)
    setOrgData(data.data.getOrganzation)
  }

  return (
    <main>
      {account === "org" ? (
        <div>
          <div className="fixed w-full opacity-50 left-0 h-full top-0 bg-black"></div>
          <div className="fixed w-96 p-2 lg:left-[38%] rounded-md top-28 bg-white">
            <div className="mt-2">
              <div className="text-xl font-bold text-center">Select Account to Start Campaign From</div>
              <div className="flex flex-column flex-wrap text-center mt-2">
                <div className="w-full flex cursor-pointer px-2 py-1" onClick={() => setAccount("user")}>
                  {user?.image === null ? (<img src="/images/logo.svg" className="w-12 h-12" alt="" />
                  ) : (<img src={user.image} className="w-12 rounded-full h-12" alt="" />
                  )}
                  <div className="text-base ml-4 my-auto capitalize">{user?.name}</div>
                </div>
                {orgs.map((org, i) => (
                  <div key={i} className="w-full flex cursor-pointer px-2 py-1" onClick={() => { singleOrg(org?._id), setAccount("") }}>
                    {org?.image === null ? (<img src="/images/logo.svg" className="w-12 h-12" alt="" />
                    ) : (<img src={org.image} className="w-12 rounded-full h-12 " alt="" />
                    )}     <div className="text-base capitalize ml-4 my-auto">{org?.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="preview-camp py-5">
        <div className="container">
          <div className=" font-weight-bolder display-4 mb-3">{camp.title}</div>
          <p className="font-weight-bold mb-4 camp-title">{camp.target}</p>
          {filePreview?.type === "image" && (
            <img
              src={filePreview.file}
              alt=""
              className="mb-4"
              style={{
                width: "100%",
                maxWidth: "30rem",
                objectFit: "contain",
                margin: "auto",
              }}
            />
          )}
          {filePreview?.type === "video" && (
            <div className="embed-responsive mb-4 embed-responsive-16by9">
              <video
                controls={true}
                className="embed-responsive-item d-block"
                style={{
                  width: "100%",
                  maxWidth: "30rem",
                  objectFit: "contain",
                  margin: "auto",
                }}
              >
                <source src={filePreview.file} type="video/mp4" />
              </video>
            </div>
          )}

          <ReactMarkdown>{camp.body}</ReactMarkdown>
          <div className="launch-camp mt-5 d-flex justify-content-center">
            {
              account === "user" ? (
                <button
                  className="btn px-3 py-2 font-weight-bolder"
                  onClick={() => setNext()}
                >
                  {loading ? "Processing your campaign..." : "Launch Campaign"}
                </button>
              ) : (
                <button
                  className="btn px-3 py-2 font-weight-bolder"
                  onClick={() => setOrgNext()}
                >
                  {loading ? "Processing your campaign..." : "Launch Campaign"}
                </button>
              )
            }
            {/* <button
              className="btn px-3 py-2 font-weight-bolder"
              onClick={() => setOrgNext()}
            >
              {loading ? "Processing your campaign..." : "Launch Campaign"}
            </button> */}
          </div>
          <h4 className="d-flex justify-content-center">
            <button
              className="btn rounded-pill text-success text-decoration-underline "
              type="button"
              onClick={() => {
                router.back();
              }}
            >
              Back to edit
            </button>
          </h4>
        </div>
      </div>
    </main>
  );
};

export default previewcamp;

// "https://www.youtube.com/embed/-ZHrj2Fhnt4"
// https://youtu.be/XGk1mpB-AlU
