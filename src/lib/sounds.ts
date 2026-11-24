let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

function getContext(): AudioContext | null {
  if (!soundEnabled) return null;
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Call from a user gesture so browsers allow playback. */
export function primeAudio() {
  getContext();
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  duration: number,
  options: {
    type?: OscillatorType;
    gain?: number;
    endFreq?: number;
    attack?: number;
  } = {},
) {
  const { type = "sine", gain = 0.12, endFreq, attack = 0.005 } = options;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
  }
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Short ratchet tick used while the wheel spins. */
export function playTick() {
  const ac = getContext();
  if (!ac) return;
  const t = ac.currentTime;
  const freq = 1100 + Math.random() * 500;
  tone(ac, freq, t, 0.05, {
    type: "triangle",
    gain: 0.05,
    endFreq: freq * 0.55,
    attack: 0.002,
  });
}

/** Airy whoosh when the spin starts. */
export function playSpinStart() {
  const ac = getContext();
  if (!ac) return;
  const t = ac.currentTime;
  const duration = 0.55;
  const buffer = ac.createBuffer(
    1,
    Math.floor(ac.sampleRate * duration),
    ac.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.1;
  filter.frequency.setValueAtTime(280, t);
  filter.frequency.exponentialRampToValueAtTime(1900, t + duration);
  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(0.05, t + 0.08);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start(t);
  src.stop(t + duration);
}

/** Bright two-note chime when the wheel lands on a question. */
export function playResult() {
  const ac = getContext();
  if (!ac) return;
  const t = ac.currentTime;
  tone(ac, 880, t, 0.22, { type: "sine", gain: 0.14 });
  tone(ac, 1318.51, t + 0.11, 0.5, { type: "sine", gain: 0.12 });
  tone(ac, 1760, t + 0.11, 0.4, { type: "triangle", gain: 0.04 });
}

/** Upbeat arpeggio when a question is marked complete. */
export function playComplete() {
  const ac = getContext();
  if (!ac) return;
  const t = ac.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    tone(ac, freq, t + i * 0.09, 0.42, { type: "triangle", gain: 0.11 });
  });
}
