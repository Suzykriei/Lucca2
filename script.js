const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const shareButton = document.getElementById('share');
const frame = document.getElementById('frame');

navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
  .then(stream => {
    video.srcObject = stream;
  });

captureButton.onclick = () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.drawImage(frame, 0, 0, canvas.width, canvas.height);

  const image = canvas.toDataURL('image/png');

  if (navigator.canShare && navigator.canShare({ files: [] })) {
    shareButton.style.display = 'inline-block';
  } else {
    const link = document.createElement('a');
    link.download = 'foto-safari.png';
    link.href = image;
    link.click();
  }
};

shareButton.onclick = () => {
  canvas.toBlob(blob => {
    const file = new File([blob], 'foto-safari.png', { type: 'image/png' });
    navigator.share({
      files: [file],
      title: 'Selfie na festa do Lucca',
      text: 'Minha foto na moldura do Safari!',
    });
  });
};