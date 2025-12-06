const musicAudio = document.getElementById("musicAudio");
const effectAudio = document.getElementById("effectAudio");
const gameOverAudio = document.getElementById("gameOverAudio");
const volumeIcon = document.getElementById("volume");
const musicSlider = document.getElementById("music");
const effectSlider = document.getElementById("effect");
const MUTE_ICON = "fa fa-volume-off";
const LOUD_ICON = "fa fa-volume-down";

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
    game over music played when lose game
*/
export function playGameOverAudio(){
    gameOverAudio.play();
    const currentVolume = musicAudio.volume;
    musicAudio.volume = 0;
    setTimeout(() => {
        musicAudio.volume = currentVolume;
    }, 2000);
}

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
musicSlider.addEventListener('input', (event) => {
    const volume = event.target.value;
    adjustVolume(musicAudio, volume);
    adjustVolume(gameOverAudio, volume);
    if (volume == 0) {
        volumeIcon.className = MUTE_ICON;
    } else {
        volumeIcon.className = LOUD_ICON;
    }
});

effectSlider.addEventListener('input', (event) => {
    adjustVolume(effectAudio, event.target.value);
});

function adjustVolume(audio, volume){
    audio.volume = volume;
}

/* 
    mute volume
*/
volumeIcon.addEventListener('click', () => {
    adjustVolume(musicAudio, 0);
    adjustVolume(gameOverAudio, 0);
    volumeIcon.className = MUTE_ICON;
    musicSlider.value = 0;
    effectSlider.value = 0;
});