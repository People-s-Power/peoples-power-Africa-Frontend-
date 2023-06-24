import React, { useEffect, useState } from 'react';
import { SERVER_URL } from "utils/constants"
import axios from "axios"
import { HIDE, UNHIDE } from "apollo/queries/generalQuery"
import { print } from "graphql"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"

const UnHideComp = ({ id, toggle }: { id: string, toggle: any }) => {
  const author = useRecoilValue(UserAtom)
  const [show, setShow] = useState(false)

  const setUndo = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(UNHIDE),
        variables: {
          authorId: author.id,
          itemId: id
        },
      })
      console.log(data)
      setShow(true)
      toggle(false)
    } catch (e) {
      console.log(e.response)
    }
  }

  return (
    show === false &&
    <div className='fixed z-30 left-0 right-0 w-full lg:bottom-10 sm:bottom-0'>
      <div className="flex px-6 lg:w-1/2 mx-auto justify-between bg-white shadow-lg border rounded-lg py-2">
        <div className='my-auto'>You have just removed an item from your timeline.</div>
        <button className='p-2 bg-warning text-white' onClick={() => setUndo()}>Undo</button>
        <img src="/images/close.png" onClick={() => setShow(true)} className="cursor-pointer w-3 h-3 ml-6 my-auto" alt="" />
      </div>
    </div>
  );
};

export default UnHideComp;