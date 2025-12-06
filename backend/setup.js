import { getUser, isLoggedIn } from './api.js';

const $ = (id) => document.getElementById(id);
const openLogin  = $('openAuthModal');
const musicAudio = $("musicAudio");
const effectAudio = $("effectAudio");
const gameOverAudio = $("gameOverAudio");

const scoreDigits = 7;
const DEFAULT_VOLUME = 0.5;

window.onload = async function () {
    const login = isLoggedIn();
    if(login){
        updateLoginStatus();
    }

    musicAudio.loop = true;
    musicAudio.volume = DEFAULT_VOLUME;
    effectAudio.volume = DEFAULT_VOLUME;
    gameOverAudio.volume = DEFAULT_VOLUME;
}

export async function updateLoginStatus() {
  try{
    const data = await getUser();
    highestScore.innerHTML = data.highestScore.toString().padStart(7, '0');
    openLogin.textContent = `${data.userId} Logged in ✓`;
  } catch (err) {
    console.error("Failed to get user data:", err);
  }
}

export function formatScore(score){
    return score.toString().padStart(scoreDigits, '0');
}