'use strict';

const tracks = [
  { id: 'lsm_march', title: 'Marcha Sanmartiniana', artist: 'Tobías Vílchez Pinedo' },
  { id: 'lsm_anthem', title: 'Himno Sanmartiniano', artist: 'Tobías Vílchez Pinedo' },
  { id: 'carnaval_macari', title: 'Carnaval Macari', image: 'lsm_anthem' },
  { id: 'carnaval_huanupampa', title: 'Carnaval Huanupampa', image: 'lsm_anthem' },
  { id: 'carnaval_huaccana', title: 'Carnaval Huaccana', image: 'lsm_anthem' },
  { id: 'cofradia_san_miguel', title: 'Cofradía San Miguel', image: 'lsm_anthem' },
  { id: 'qapackachampa', title: 'Qapackachampa', image: 'lsm_anthem' },
];
const audio = document.querySelector('#audio');
const cards = [...document.querySelectorAll('[data-track]')];
const playButton = document.querySelector('#play');
const seek = document.querySelector('#seek');
const volume = document.querySelector('#volume');
const muteButton = document.querySelector('#mute');
const status = document.querySelector('#status');
let currentIndex = -1;
let requestId = 0;
let playbackFailed = false;
let failedSources = 0;

function showLoadError() {
  playbackFailed = true;
  ++requestId;
  audio.pause();
  status.textContent = 'No se pudo cargar el audio. Comprueba tu conexión y pulsa reproducir para reintentar.';
  updatePlayback();
}

function formatTime(seconds) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

function updatePlayback() {
  const playing = !audio.paused && !audio.ended;
  playButton.querySelector('use').setAttribute('href', playing ? '#icon-pause' : '#icon-play');
  playButton.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
  cards.forEach((card, index) => {
    const active = index === currentIndex;
    card.setAttribute('aria-pressed', String(active));
    card.setAttribute('aria-label', `${active && playing ? 'Pausar' : 'Reproducir'} ${tracks[index].title}`);
  });
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}

function updateTimeline() {
  const duration = audio.duration;
  const ready = Number.isFinite(duration) && duration > 0;
  seek.disabled = !ready;
  seek.max = ready ? duration : 100;
  seek.value = ready ? audio.currentTime : 0;
  seek.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} de ${formatTime(duration)}`);
}

async function startPlayback() {
  const thisRequest = ++requestId;
  status.textContent = '';
  if (audio.error || playbackFailed) {
    playbackFailed = false;
    failedSources = 0;
    audio.load();
  }
  try {
    await audio.play();
  } catch (error) {
    if (thisRequest !== requestId || error.name === 'AbortError') return;
    status.textContent = error.name === 'NotAllowedError'
      ? 'Pulsa reproducir para iniciar la música.'
      : 'No se pudo cargar el audio. Comprueba tu conexión y pulsa reproducir para reintentar.';
    updatePlayback();
  }
}

function selectTrack(index) {
  if (index === currentIndex) {
    togglePlayback();
    return;
  }
  ++requestId;
  audio.pause();
  currentIndex = index;
  playbackFailed = false;
  failedSources = 0;
  const track = tracks[index];
  audio.replaceChildren(...['mp3', 'ogg'].map((extension) => {
    const source = document.createElement('source');
    source.src = `assets/audio/${track.id}.${extension}`;
    source.type = extension === 'ogg' ? 'audio/ogg' : 'audio/mpeg';
    source.addEventListener('error', () => {
      if (!source.isConnected) return;
      if (++failedSources === 2) showLoadError();
    });
    return source;
  }));
  audio.load();
  document.querySelector('#player-title').textContent = track.title;
  document.title = track.title;
  document.querySelector('.title-bar img').src = `assets/images/${track.image || track.id}.png`;
  updateTimeline();
  updatePlayback();
  if ('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title, artist: track.artist || '', album: 'Colección sanmartiniana · LSM',
    });
  }
  void startPlayback();
}

function togglePlayback() {
  if (currentIndex < 0) return selectTrack(0);
  if (audio.paused || audio.ended) {
    if (audio.ended) audio.currentTime = 0;
    void startPlayback();
  } else {
    ++requestId;
    audio.pause();
  }
}

function moveTrack(direction) {
  const nextIndex = currentIndex < 0 ? (direction > 0 ? 0 : tracks.length - 1)
    : (currentIndex + direction + tracks.length) % tracks.length;
  selectTrack(nextIndex);
}

cards.forEach((card, index) => card.addEventListener('click', () => selectTrack(index)));
playButton.addEventListener('click', togglePlayback);
document.querySelector('#stop').addEventListener('click', () => {
  ++requestId;
  audio.pause();
  if (Number.isFinite(audio.duration)) audio.currentTime = 0;
  updateTimeline();
});
document.querySelector('#previous').addEventListener('click', () => moveTrack(-1));
document.querySelector('#next').addEventListener('click', () => moveTrack(1));
['play', 'pause', 'ended'].forEach((event) => audio.addEventListener(event, updatePlayback));
['loadedmetadata', 'durationchange', 'timeupdate', 'emptied'].forEach((event) => audio.addEventListener(event, updateTimeline));
audio.addEventListener('playing', () => { status.textContent = ''; });
audio.addEventListener('waiting', () => { status.textContent = 'Cargando audio…'; });
audio.addEventListener('error', () => {
  if (currentIndex >= 0) showLoadError();
});
seek.addEventListener('input', () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value);
  updateTimeline();
});
audio.volume = Number(volume.value);
volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
  audio.muted = false;
});
muteButton.addEventListener('click', () => {
  if (audio.volume === 0) {
    audio.volume = 0.8;
    volume.value = 0.8;
    audio.muted = false;
  } else audio.muted = !audio.muted;
});
audio.addEventListener('volumechange', () => {
  const silent = audio.muted || audio.volume === 0;
  muteButton.setAttribute('aria-label', silent ? 'Activar sonido' : 'Silenciar');
  muteButton.setAttribute('aria-pressed', String(silent));
  muteButton.querySelector('use').setAttribute('href', silent ? '#icon-muted' : '#icon-volume');
  volume.value = audio.muted ? 0 : audio.volume;
});
if ('mediaSession' in navigator) {
  for (const [action, handler] of Object.entries({
    play: () => currentIndex < 0 ? selectTrack(0) : void startPlayback(),
    pause: () => { ++requestId; audio.pause(); },
    previoustrack: () => moveTrack(-1), nexttrack: () => moveTrack(1),
  })) {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Some browsers omit these actions. */ }
  }
}
