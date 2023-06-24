import React, { useState, useCallback } from 'react';
import ImageViewer from 'react-simple-image-viewer';

const ImageCarousel = ({ image }: { image: any }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState(image);


  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div>
      <div className="relative">
        <div className="grid grid-flow-col auto-cols-auto grid-flow-row auto-rows-auto gap-1">
          {
            image.slice(0, 3).map((image, index) =>
              <img key={index} onClick={() => openImageViewer(index)} className="w-full cursor-pointer h-80 rounded-md object-cover" src={image} alt="" />
            )
          }
        </div>
        <div>
          {image.length > 3 ? (
            <div onClick={() => openImageViewer(0)} className="w-[33%] rounded-md h-full bg-black opacity-75 text-3xl text-white text-center absolute top-0 right-0 py-32 cursor-pointer">+{image.length - 3}</div>
          ) : null}
        </div>
      </div>
      <div className="z-50">
        {isViewerOpen && (
          <ImageViewer
            src={images}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;