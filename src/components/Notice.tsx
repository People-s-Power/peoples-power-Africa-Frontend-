import { UserAtom } from "atoms/UserAtom";
import React, { useState } from "react";
import cookie from "js-cookie";
import { useRecoilValue } from "recoil";
// import socketIOClient from "socket.io-client";
import { TOKEN_NAME, WS_URI } from "../utils/constants";

const NoticeList = (props: any): JSX.Element => {
	const user = useRecoilValue(UserAtom);

	return (
			<div className="bg-white w-72  absolute top-[82px] right-[84px] rounded-xl shadow-xl p-1">
        <ul className="p-2 overflow-auto">
          {props.notification.slice(0, 6).map((notice: any, i: any) => (
            <li className="flex border-b border-gray-200 mt-2" key={i}>
            <img
              src={user?.image}
              alt=""
              className="image rounded-circle border border-gray-200 h-[30px] w-[35px] mr-2"
            />
              <div className="text-sm">{notice.message}</div>
              </li>
          ))}
        </ul>
    </div>
	)};

export default NoticeList;
