Fashion Image Processing Application

This application allows users to upload fashion product images or provide image URLs. It processes these images to generate different views such as Neck Shot, Sleeve Shot, Zoomed View, Waist View, and Length View. The project consists of two parts:

1. Client (React.js frontend)
2. Server (Node.js with Express.js for backend image processing)

**Features:**
- Real-time image processing
- Multiple views from a single image
- Integration with pose detection library for view extraction

**Prerequisites:**
Make sure you have the following installed on your machine:
- Node.js (v16 or higher) and npm
- MongoDB (for image processing storage)
- Git (for version control)

**Project Setup:**
The project contains two separate applications for the client and server, each with its own package.json file. Follow the steps below to set up both.

1. Clone the repository:
```bash
git clone https://github.com/soumyasaswata/fashion-image-processing.git
cd fashion-image-processing
```

2. Setup Server:
Navigate to the server directory:
```bash
cd server
```
Install the dependencies:
```bash
npm install
```
Configure environment variables by creating a .env file in the server directory with the following values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fashion-image-processing
```
Run the server:
```bash
npm start
```
The server will start at http://localhost:5000.

3. Setup Client:
Navigate to the client directory:
```bash
cd ../client
```
Install the dependencies:
```bash
npm install
```
Run the client:
```bash
npm start
```
The client will start at http://localhost:3000.

Output ScreenShots:
Image 1:
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%2012.38.06%E2%80%AFAM.png)
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%2012.38.22%E2%80%AFAM.png)
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%2012.38.26%E2%80%AFAM.png)

Image 2:
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%2012.39.01%E2%80%AFAM.png)
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%2012.39.09%E2%80%AFAM.png)
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%2012.39.16%E2%80%AFAM.png)

Server run screenshots:
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%201.00.53%E2%80%AFAM%20(2).png)
![Sample Output Image screenshots](https://github.com/soumyasaswata/fashion-image-processing/blob/main/screenshots/Screenshot%202024-09-10%20at%201.01.03%E2%80%AFAM%20(2).png)

**Running the Application:**
Once both the server and client are running:
- Open your browser and go to http://localhost:3000.

**Future Improvements:**

- Add support for processing image URLs in addition to image uploads.
- Implement batch processing functionality to process multiple images at once.
- Set up CI/CD pipeline for automated deployment to streamline the release process.
- Optimize performance to enhance the speed and efficiency of image processing.

