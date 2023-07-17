import React, { useState } from 'react';
export class Asset {
  url: string;
  type: AssetEnum;
  length: number;
}

export enum AssetEnum {
  image = 'image',
  video = 'video'
}
const ImageViewer = ({ src, currentIndex, onClose }: { src: Asset, currentIndex: number, onClose: any }) => {
  const [index, setIndex] = useState(currentIndex)

  return (
    <div className='fixed w-full h-screen left-0 right-0 z-50 top-0 bg-black'>
      <div className='flex justify-between lg:mt-20 mt-40'>
        <div className='my-auto p-2' onClick={() => index === 0 ? null : setIndex(index - 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ffffff" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
          </svg>
        </div>
        <div className='w-[60%]'>
          {src[index]?.type === 'image' ? <img className="mx-auto my-auto" src={src[index]?.url} /> : src[index]?.type === 'video' ?
            <video controls className="w-full">
              <source src={src[index]?.url} type="video/mp4" />
            </video> : null}
        </div>
        <div className='my-auto p-2 cursor-pointer' onClick={() => index === src.length - 1 ? setIndex(0) : setIndex(index + 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ffffff" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
        </div>
      </div>
      <div onClick={onClose} className='absolute right-3 top-28'>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#ffffff" className="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
      </div>
    </div>
  );
};

export default ImageViewer;