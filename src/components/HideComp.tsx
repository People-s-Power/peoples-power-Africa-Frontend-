import React, { useEffect, useState } from 'react';
import { SERVER_URL } from "utils/constants"
import axios from "axios"
import { HIDE, UNHIDE } from "apollo/queries/generalQuery"
import { print } from "graphql"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"

interface IProps {
  id: string;
  toggle?: any
}


const HideComp = ({ id, toggle }: IProps) => {
  const author = useRecoilValue(UserAtom)

  const hide = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(HIDE),
        variables: {
          authorId: author.id,
          itemId: id
        },
      })
      console.log(data)
      toggle(true)
    } catch (e) {
      console.log(e.response)
    }
  }


  return (
    <div className='w-[10%] my-auto ml-auto'>
      <img src="/images/close.png" onClick={() => hide()} className="cursor-pointer w-3 h-3 ml-auto my-auto" alt="" />
    </div>
  );
};

export default HideComp;