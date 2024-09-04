//src/components/UploadImage.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = ({ onImagesUpload }) => {
    const [imageUrls, setImageUrls] = useState('');
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleUrlsChange = (e) => {
        setImageUrls(e.target.value);
    };

    const handleUrlsSubmit = async () => {
        const urls = imageUrls.split(',').map(url => url.trim());
        try {
            const response = await axios.post('http://localhost:5000/api/images/urls', { urls });
            setStatus('URLs uploaded successfully. Processing...');
            onImagesUpload(response.data.shots || []); // Adjust based on server response
        } catch (error) {
            console.error('Error uploading URLs:', error);
            setStatus('Error uploading URLs.');
        }
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('image', file);
        });
        try {
            const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Server response:', response.data);
            setStatus('Files uploaded successfully. Processing...');
            onImagesUpload(response.data.shots || []); // Adjust based on server response
        } catch (error) {
            console.error('Error uploading files:', error);
            setStatus('Error uploading files.');
        }
    };

    return (
        <div>
            <h3>Upload Images</h3>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <textarea
                    placeholder="Enter multiple image URLs, separated by commas"
                    value={imageUrls}
                    onChange={handleUrlsChange}
                    style={{ width: '300px', height: '100px', marginTop: '10px' }}
                />
                <button onClick={handleUrlsSubmit} style={{ marginTop: '10px' }}>
                    Upload URLs
                </button>
                <button onClick={handleFileUpload} style={{ marginTop: '10px' }}>
                    Upload Files
                </button>
            </div>
            {status && <p>{status}</p>}
        </div>
    );
};

export default UploadImage;
