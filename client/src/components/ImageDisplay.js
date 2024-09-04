import React from 'react';

const placeholder = 'https://via.placeholder.com/200';

const ImageDisplay = ({ images }) => {
    console.log('Images:', images); // Verify the images data

    return (
        <div>
            {images.length === 0 && <p>No images to display</p>}
            {images.map((image, index) => (
                <div key={index} style={{ margin: '20px' }}>
                    <h4>Image {index + 1}</h4>
                    {/* Check if image is a string or an object */}
                    {typeof image === 'string' ? (
                        <img
                            src={`data:image/jpeg;base64,${image}`}
                            alt={`Processed ${index}`}
                            style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.src = placeholder;
                                console.log(`Error loading image at index ${index}, fallback to placeholder.`);
                            }}
                        />
                    ) : (
                        <>
                            {/* Main Image */}
                            <img
                                src={`data:image/jpeg;base64,${image.data}`}
                                alt={`Processed ${index}`}
                                style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = placeholder;
                                    console.log(`Error loading image at index ${index}, fallback to placeholder.`);
                                }}
                            />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImageDisplay;
