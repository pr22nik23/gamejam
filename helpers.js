export function isCollision(rect1, rect2) {
    if (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
      ) {
        return true
      } else {
       return false
      }
}

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function playSound(soundName) {
  fetch(soundName)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
          var source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start(0);
      })
      .catch(e => console.error('Error with fetching or decoding audio data: ' + e));
}