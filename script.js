// Utility: play audio safely after user gesture
async function playMusic(audioEl){
  try{
    audioEl.muted = false;
    await audioEl.play();
  }catch(e){
    // If blocked, show native controls as a fallback
    audioEl.controls = true;
    console.warn('Autoplay was blocked. Showing controls.', e);
  }
}

// Load Lottie animation (Indian Muslim wedding vibe)
// Put your JSON file at assets/animations/nikah-animation.json
function loadWeddingAnimation(){
  try{
    if(!window.lottie){ return; }
    lottie.loadAnimation({
      container: document.getElementById('wedding-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/nikah-animation.json' // <-- replace with your JSON if needed
    });
  }catch(e){
    console.warn('Lottie failed:', e);
  }
}

/*window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('enter-overlay');
  const enterBtn = document.getElementById('enter-btn');
  const bgMusic = document.getElementById('bg-music');

  // Prepare audio
  // Some browsers require a user gesture to start audio; handled on button click.
  bgMusic.volume = 0.7;

  enterBtn.addEventListener('click', async () => {
    overlay.classList.add('hidden');
    await playMusic(bgMusic);
    loadWeddingAnimation();
    // Optional: remove overlay from DOM after fade-out
    setTimeout(() => overlay.remove(), 700);
  });

  // As a courtesy, if user scrolls/taps outside button, also trigger
  overlay.addEventListener('click', async (e) => {
    if(e.target === overlay){
      overlay.classList.add('hidden');
      await playMusic(bgMusic);
      loadWeddingAnimation();
      setTimeout(() => overlay.remove(), 700);
    }
  });
});*/

window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('enter-overlay');
  const enterBtn = document.getElementById('enter-btn');
  const bgMusic = document.getElementById('bg-music'); // existing <audio> element
  const ytFrame = document.getElementById('wedding-video');

  // Optional: if you prefer video music instead of site background song, set this:
  const USE_VIDEO_AUDIO = false; // set to false if you want your MP3 instead

  if (bgMusic) {
    bgMusic.volume = 0.7;
  }

  async function beginExperience() {
    overlay.classList.add('hidden');

    // Start background music OR keep it muted depending on preference
    if (!USE_VIDEO_AUDIO && bgMusic) {
      await playMusic(bgMusic); // your existing helper
    } else if (bgMusic) {
      // Ensure background track doesn't clash with video audio
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }

    // Start the YouTube video
    playYouTube(ytFrame);

    // If you want to unmute the video AFTER user action:
    unmuteYouTube(ytFrame);

    setTimeout(() => overlay.remove(), 700);
  }

  enterBtn.addEventListener('click', beginExperience);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) beginExperience();
  });
});

// --- YouTube Player Helpers ---
function postToYouTube(iframe, command, args = []) {
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(JSON.stringify({
    event: 'command',
    func: command,
    args: args
  }), '*');
}

function playYouTube(iframe)    { postToYouTube(iframe, 'playVideo'); }
function pauseYouTube(iframe)   { postToYouTube(iframe, 'pauseVideo'); }
function muteYouTube(iframe)    { postToYouTube(iframe, 'mute'); }
function unmuteYouTube(iframe)  { postToYouTube(iframe, 'unMute'); }