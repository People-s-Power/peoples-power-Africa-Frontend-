import React, { useState, useEffect } from 'react';
import { socket } from "pages/_app"

const Online = ({ id }: { id: any }) => {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    socket.emit('get_online_status', id, response => {
      // console.log(response)
      setOnline(response)
    });
  }, [])
  return (
    <>
      <div className='my-auto h-3'>
        {
          online ? <div className="mr-1 bg-green-500 w-3 h-3 my-auto rounded-full"></div> : <div className="mr-1 bg-gray-500 w-3 h-3 my-auto rounded-full"></div>
        }
      </div>
    </>
  );
};

export default Online;