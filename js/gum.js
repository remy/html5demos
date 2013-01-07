var video = document.querySelector('video');

function gumSuccess(stream) {
  // window.stream = stream;
  if ('mozSrcObject' in video) {
    video.mozSrcObject = stream;
  } else if (window.webkitURL) {
    video.src = window.webkitURL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
  video.play();
}

function gumError(error) {
  console.error('Error on getUserMedia', error);
}

function gumInit() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true }, gumSuccess, gumError);
  }
}

gumInit();