const tf = require('@tensorflow/tfjs-node');
const poseDetection = require('@tensorflow-models/pose-detection');
const sharp = require('sharp');

const loadModel = async () => {
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
    return detector;
};

const detectPose = async (imageBuffer) => {
    console.log('Inside detectPose');
    const imageTensor = tf.node.decodeImage(imageBuffer);
    const detector = await loadModel();
    const poses = await detector.estimatePoses(imageTensor);

    return poses;
};

const generateShots = async (imageBuffer) => {
    const poses = await detectPose(imageBuffer);
    const shots = [];

    console.log('Detected poses:', poses);

    // Full view (original image)
    shots.push({ viewType: 'full', data: imageBuffer.toString('base64') });

    // Get image dimensions
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const imageWidth = metadata.width;
    const imageHeight = metadata.height;

    for (let pose of poses) {
        const { keypoints } = pose;
        console.log('Detected keypoints:', keypoints);

        const leftShoulderKeyPoint = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulderKeyPoint = keypoints.find(kp => kp.name === 'right_shoulder');
        const leftElbowKeyPoint = keypoints.find(kp => kp.name === 'left_elbow');
        const rightElbowKeyPoint = keypoints.find(kp => kp.name === 'right_elbow');
        const leftWristKeyPoint = keypoints.find(kp => kp.name === 'left_wrist');
        const rightWristKeyPoint = keypoints.find(kp => kp.name === 'right_wrist');
        const leftAnkleKeyPoint = keypoints.find(kp => kp.name === 'left_ankle');
        const rightAnkleKeyPoint = keypoints.find(kp => kp.name === 'right_ankle');
        const leftKneeKeyPoint = keypoints.find(kp => kp.name === 'left_knee');
        const rightKneeKeyPoint = keypoints.find(kp => kp.name === 'right_knee');
        const noseKeyPoint = keypoints.find(kp => kp.name === 'nose');
        const leftHipKeyPoint = keypoints.find(kp => kp.name === 'left_hip');
        const rightHipKeyPoint = keypoints.find(kp => kp.name === 'right_hip');


        // Function to safely extract a region from the image
        const extractRegion = async (centerX, centerY, width, height) => {
            const extractLeft = Math.max(0, Math.round(centerX - width / 2));
            const extractTop = Math.max(0, Math.round(centerY - height / 2));
            const extractWidth = Math.min(width, imageWidth - extractLeft);
            const extractHeight = Math.min(height, imageHeight - extractTop);

            return image
                .extract({
                    left: extractLeft,
                    top: extractTop,
                    width: extractWidth,
                    height: extractHeight
                })
                .resize(400, 400)
                .toBuffer();
        };

        // Neck view
        if (leftShoulderKeyPoint && rightShoulderKeyPoint && noseKeyPoint) {
            const neckX = (leftShoulderKeyPoint.x + rightShoulderKeyPoint.x) / 2;
            const neckY = (leftShoulderKeyPoint.y + rightShoulderKeyPoint.y) / 2;

            const faceTopY = Math.min(noseKeyPoint.y, neckY) - 200; // Include some space above the nose
            const chestBottomY = Math.max(leftShoulderKeyPoint.y, rightShoulderKeyPoint.y) + 100; // Include some space below the shoulders

            const neckHeight = chestBottomY - faceTopY;
            const neckWidth = Math.abs(rightShoulderKeyPoint.x - leftShoulderKeyPoint.x) + 100; // Include some space around the shoulders

            try {
                const neckShotBuffer = await sharp(imageBuffer)
                    .extract({
                        left: Math.round(neckX - neckWidth / 2),
                        top: Math.round(faceTopY),
                        width: Math.round(neckWidth),
                        height: Math.round(neckHeight)
                    })
                    .resize(400, 600) // Optional: Resize to a larger size for better quality
                    .toBuffer();

                shots.push({ viewType: 'neck', data: neckShotBuffer.toString('base64') });
            } catch (error) {
                console.error('Error processing neck shot:', error);
            }
        }

        // Sleeve view (both sleeves visible)
        if (leftShoulderKeyPoint && rightShoulderKeyPoint && leftKneeKeyPoint && rightKneeKeyPoint) {
            const left = Math.min(leftShoulderKeyPoint.x, rightShoulderKeyPoint.x);
            const right = Math.max(leftShoulderKeyPoint.x, rightShoulderKeyPoint.x);
            const top = Math.min(leftShoulderKeyPoint.y, rightShoulderKeyPoint.y) + 50; // Slightly above waist
            const bottom = Math.max(leftKneeKeyPoint.y, rightKneeKeyPoint.y) - 50; // Slightly below knees

            const sleeveShotBuffer = await sharp(imageBuffer)
                .extract({
                    left: Math.round(left),
                    top: Math.round(top),
                    width: Math.round(right - left),
                    height: Math.round(bottom - top)
                })
                .resize(400, 800) // Optional: Resize for consistent output
                .toBuffer();

            shots.push({ viewType: 'sleeve', data: sleeveShotBuffer.toString('base64') });
        }

        // Waist view (from below waist to nose)
        if (noseKeyPoint && leftHipKeyPoint && rightHipKeyPoint) {
            const waistTopX = Math.min(leftHipKeyPoint.x, rightHipKeyPoint.x);
            const waistTopY = (leftHipKeyPoint.y + rightHipKeyPoint.y) / 2;
            const waistWidth = Math.abs(leftHipKeyPoint.x - rightHipKeyPoint.x) * 2; // Double the width for a broader view
            const waistHeight = Math.abs(waistTopY - noseKeyPoint.y) + 100; // Additional height below the hips

            try {
                const waistShotBuffer = await sharp(imageBuffer)
                    .extract({
                        left: Math.round(waistTopX - waistWidth / 2),
                        top: Math.round(noseKeyPoint.y),
                        width: Math.round(waistWidth),
                        height: Math.round(waistHeight)
                    })
                    .resize(400, 600) // Resize to a standard size
                    .toBuffer();

                shots.push({ viewType: 'waist', data: waistShotBuffer.toString('base64') });
            } catch (error) {
                console.error('Error processing waist shot:', error);
            }
        }

        // Length view (from lower hip to bottom)
        if (leftHipKeyPoint && rightHipKeyPoint && leftAnkleKeyPoint && rightAnkleKeyPoint) {
            const lengthX = (leftHipKeyPoint.x + rightHipKeyPoint.x) / 2;
            const lengthY = (leftHipKeyPoint.y + rightHipKeyPoint.y) / 2;
            const lengthWidth = Math.abs(rightHipKeyPoint.x - leftHipKeyPoint.x) + 100; // Extra width to capture both legs
            const lengthHeight = imageHeight - Math.min(leftHipKeyPoint.y, rightHipKeyPoint.y); // Height from lower hip to bottom of image

            try {
                const lengthShotBuffer = await sharp(imageBuffer)
                    .extract({
                        left: Math.max(0, Math.round(lengthX - lengthWidth / 2)),
                        top: Math.max(0, Math.round(lengthY - (lengthHeight - (imageHeight - lengthY)))), // Adjust top position to ensure it starts from the lower hip
                        width: Math.round(lengthWidth),
                        height: Math.round(lengthHeight)
                    })
                    .resize(400, 800) // Resize for consistent output size
                    .toBuffer();

                shots.push({ viewType: 'length', data: lengthShotBuffer.toString('base64') });
            } catch (error) {
                console.error('Error processing length shot:', error);
            }
        }

        // Zoomed view
        try {
            const zoomedShotBuffer = await image.resize(300, 300).toBuffer();
            shots.push({ viewType: 'zoomed', data: zoomedShotBuffer.toString('base64') });
        } catch (error) {
            console.error('Error processing zoomed shot:', error);
        }
    }

    return shots;
};

module.exports = {
    generateShots,
};
