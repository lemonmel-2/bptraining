const musicAudio = document.getElementById("musicAudio");
const effectAudio = document.getElementById("effectAudio");
const gameOverAudio = document.getElementById("gameOverAudio");
const volumeIcon = document.getElementById("volume");
const MUTE_ICON = "fa fa-volume-off";
const LOUD_ICON = "fa fa-volume-down";
const DEFAULT_VOLUME = 0.5;

window.onload = function () {
    musicAudio.loop = true;
    musicAudio.volume = DEFAULT_VOLUME;
    effectAudio.volume = DEFAULT_VOLUME;
    gameOverAudio.volume = DEFAULT_VOLUME;
}

/* 
    background music only start playing when user interact with page
*/
function playMusicOnce() {
  musicAudio.play();
  volumeIcon.className = LOUD_ICON;
  window.removeEventListener("click", playMusicOnce);
  window.removeEventListener("keydown", playMusicOnce);
}

window.addEventListener("click", playMusicOnce);
window.addEventListener("keydown", playMusicOnce);

/* 
    effect music triggered when user interact with page
*/
function playEffect(){
    effectAudio.currentTime = 0;
    effectAudio.play();
}

window.addEventListener('keydown', playEffect);

/* 
    adjust volume function
*/
document.getElementById("music").addEventListener('input', (event) => {
    const volume = event.target.value;
    musicAudio.volume = volume;
    gameOverAudio.volume = volume;
    if (volume == 0) {
        volumeIcon.className = MUTE_ICON;
    } else {
        volumeIcon.className = LOUD_ICON;
    }
});

document.getElementById("effect").addEventListener('input', (event) => {
    const volume = event.target.value;
    effectAudio.volume = volume;
});

export function playGameOverAudio(){
    gameOverAudio.play();
    const currentVolume = musicAudio.volume;
    musicAudio.volume = 0;
    setTimeout(() => {
        musicAudio.volume = currentVolume;
    }, 2000);
}
