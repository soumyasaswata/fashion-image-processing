// src/App.js
import React, { useState } from 'react';
import UploadImage from './components/UploadImage';
import ImageDisplay from './components/ImageDisplay';
import Header from './components/Header';

const App = () => {
    const [images, setImages] = useState([]);

    const handleImagesUpload = (uploadedImages) => {
        // Assuming uploadedImages is an array of image data objects
        setImages(uploadedImages);
    };

    return (
        <div>
            <Header />
            <UploadImage onImagesUpload={handleImagesUpload} />
            <ImageDisplay images={images} />
        </div>
    );
};

export default App;
