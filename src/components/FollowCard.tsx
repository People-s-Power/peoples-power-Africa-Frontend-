import { FOLLOW } from 'apollo/queries/generalQuery';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { SERVER_URL } from 'utils/constants';
import { print } from "graphql"


import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"

interface IProps {
  user: any;
  active?: any;
}

const FollowCard = ({ user, active }: IProps) => {
  const [loading, setLoading] = useState(false)
  const author = useRecoilValue(UserAtom)

  const follow = async (id) => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(FOLLOW),
        variables: {
          followerId: author.id,
          followId: id,
        },
      })
      console.log(data)
      setLoading(true)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="lg:w-[19%] border border-neutral-600 rounded-xl text-center my-2 bg-gray-300 w-1/2 p-6">
      <Link href={`user?page=${user._id}`}>
        <div className="cursor-pointer">
          <img src={user.image} className="w-16 mx-auto h-16 rounded-full" alt="" />
          <div className="lg:text-base text-lg py-2">{user.name} </div>
        </div>
      </Link>
      {/* <div className="w-16 h-[1px] bg-gray-200"></div> */}
      <div className="text-xs text-gray-700 my-3">{user.followers.length} Followers</div>
      <p className='text-xs my-2'>{user.description}</p>
      {
        active === 'followers' ? <Link href={`/messages?page=${user._id}`}>
          <div className="text-xs border border-warning lg:p-3 p-2 sm:text-xs text-gray-900 my-6 text-center rounded-full cursor-pointer">Send message</div>
        </Link> : loading ? <p className='text-xs text-warning'>Following...</p> : <div className="text-xs border p-2 rounded-full border-warning  text-gray-900 my-6 cursor-pointer" onClick={() => follow(user._id)}>
          + Follow
        </div>
      }
    </div>
  );
};

export default FollowCard;