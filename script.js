const video = document.getElementById('video');
const frame = document.getElementById('frame');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const snapBtn = document.getElementById('snap');
const shareBtn = document.getElementById('share');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

snapBtn.addEventListener('click', () => {
  // Usa o tamanho real do vídeo para o canvas
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Desenha o vídeo
  ctx.drawImage(video, 0, 0, width, height);

  // Desenha a moldura em cima do vídeo
  const img = new Image();
  img.src = frame.src;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);

    // Salva a imagem final
    const dataUrl = canvas.toDataURL('image/png');
    photo.src = dataUrl;
    shareBtn.style.display = 'inline-block';

    // Para download automático:
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'foto-com-moldura.png';
    link.click();
  };
});

shareBtn.addEventListener('click', () => {
  const dataUrl = photo.src;

  // Para compartilhar pelo navegador, precisa verificar suporte
  if (navigator.canShare && navigator.canShare({ files: [] })) {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'foto.png', { type: 'image/png' });
        navigator.share({
          files: [file],
          title: 'Minha selfie!',
          text: 'Olha essa foto linda com a moldura da festa!'
        });
      });
  } else {
    alert('O compartilhamento direto não é compatível com seu navegador. Você pode salvar a foto e postar manualmente!');
  }
});
