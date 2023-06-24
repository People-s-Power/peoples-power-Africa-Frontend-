import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Modal } from 'rsuite';

const NotificationCard = ({ hide, msg, link, close }: { hide: boolean, msg: string, link: any, close: any }) => {
  const [show, setShow] = useState(hide)

  const undo = () => {

  }

  return (
    <>
      <div className='fixed bottom-10 w-full left-0 right-0 z-10'>
        {show &&
          <Modal open={show} onClose={() => close()}>
            <Modal.Header>Success</Modal.Header>
            <Modal.Body>
              <div className='text-center'>
                <img src="/images/success.png" className='mx-auto w-32 my-4' alt="" />
                <div>{msg} <Link href={link}><span className='text-warning cursor-pointer'>View</span></Link></div>
              </div>
            </Modal.Body>
          </Modal>
        }
      </div>
    </>
  );
};

export default NotificationCard;