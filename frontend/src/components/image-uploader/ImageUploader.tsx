import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';

interface ImageUploaderProps {
    callback: (imageSrc: string) => void;
}

export const ImageUploader = ({callback} : ImageUploaderProps) => {
    const [images, setImages] = useState([]);

    const onChange = (imageList: any, addUpdateIndex: any) => {
      // data for submit
      setImages(imageList);
      callback(imageList[addUpdateIndex].data_url);
    };

    return(
        <ImageUploading
        value={images}
        onChange={onChange}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            {/* &nbsp;
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
              </div>
            ))} */}
          </div>
        )}
      </ImageUploading>
    )
}