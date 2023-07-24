/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import axios from "axios";
import cookie from "js-cookie";
// @ts-ignore
import { FacebookProvider, LoginButton } from 'react-facebook'
import { IUser } from "types/Applicant.types";
import { TOKEN_NAME } from "utils/constants";
import FacebookLogin from 'react-facebook-login';

const Facebook = ({ onSuccess }: {
  onSuccess(e: IUser): void;
}): JSX.Element => {
  const [errorMsg, setErrorMsg] = useState()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const handleResponse = async () => {
    try {
      setLoading(true);
      const name = profile.name.split(" ")
      const payload = {
        facebookId: profile.id,
        email: profile.email,
        name: profile.name,
        firstName: name[0],
        lastName: name[1],
        image: profile.picture.data.url
      }
      const { data } = await axios.post("/auth/google-facebook", payload)
      console.log(data)
      cookie.set("user_id", data.id);
      cookie.set(TOKEN_NAME, data?.token);
      onSuccess(data)
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  const handleError = (error: any): void => {
    console.log({ error });
  }
  const responseFacebook = (response) => {
    console.log(response);
    setProfile(response)
    handleResponse()
  }
  // 1269676020167482
  return (
    <FacebookLogin
      appId="799422665107203"
      callback={responseFacebook}
      cssClass="m-[10px]"
      textButton=''
      fields="name,email,picture"
      icon={<span>
        <svg
          width="29"
          height="29"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg>
      </span>}
    />
  );
}

export default Facebook