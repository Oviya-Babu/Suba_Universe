// Cozy Rain ASMR Ambient Sound Generator using Web Audio API
// Synthesizes natural, warm, comforting rainfall with gentle droplets hitting glass

import { getAudioContext } from './sfx';

class RainASMRManager {
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private dropletInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private volume = 0.22; // Cozy, comforting default ASMR level
  private userMuted = false;

  constructor() {}

  // Generate pink noise buffer (smoother, deeper, more soothing than white noise)
  private createRainBuffer(ctx: AudioContext, seconds = 6): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0, b6L = 0;
    let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0, b6R = 0;

    for (let i = 0; i < bufferSize; i++) {
      // Left channel pink noise
      const whiteL = Math.random() * 2 - 1;
      b0L = 0.99886 * b0L + whiteL * 0.0555179;
      b1L = 0.99332 * b1L + whiteL * 0.0750759;
      b2L = 0.96900 * b2L + whiteL * 0.1538520;
      b3L = 0.86650 * b3L + whiteL * 0.3104856;
      b4L = 0.55000 * b4L + whiteL * 0.5329522;
      b5L = -0.7616 * b5L - whiteL * 0.0168980;
      left[i] = (b0L + b1L + b2L + b3L + b4L + b5L + b6L + whiteL * 0.5362) * 0.08;
      b6L = whiteL * 0.115926;

      // Right channel pink noise (stereo decorrelation)
      const whiteR = Math.random() * 2 - 1;
      b0R = 0.99886 * b0R + whiteR * 0.0555179;
      b1R = 0.99332 * b1R + whiteR * 0.0750759;
      b2R = 0.96900 * b2R + whiteR * 0.1538520;
      b3R = 0.86650 * b3R + whiteR * 0.3104856;
      b4R = 0.55000 * b4R + whiteR * 0.5329522;
      b5R = -0.7616 * b5R - whiteR * 0.0168980;
      right[i] = (b0R + b1R + b2R + b3R + b4R + b5R + b6R + whiteR * 0.5362) * 0.08;
      b6R = whiteR * 0.115926;
    }

    return buffer;
  }

  public start() {
    if (this.isRunning || this.userMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 2.5);
      this.masterGain.connect(ctx.destination);

      // Lowpass filter for cozy muffled indoor rain sound
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(620, ctx.currentTime);
      lowpass.Q.setValueAtTime(1.2, ctx.currentTime);

      // Highpass to remove any harsh rumble
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(90, ctx.currentTime);

      // Gentle peaking filter for raindrop hiss/patter
      const patterFilter = ctx.createBiquadFilter();
      patterFilter.type = 'peaking';
      patterFilter.frequency.setValueAtTime(1400, ctx.currentTime);
      patterFilter.Q.setValueAtTime(2.0, ctx.currentTime);
      patterFilter.gain.setValueAtTime(3.5, ctx.currentTime);

      this.noiseBufferSource(ctx, [highpass, lowpass, patterFilter, this.masterGain]);

      // Subtle occasional raindrop droplet pings (ASMR window drops)
      this.startDropletSimulator(ctx);

      this.isRunning = true;
    } catch (e) {
      console.warn('Could not initialize rain ASMR:', e);
    }
  }

  private noiseBufferSource(ctx: AudioContext, chain: AudioNode[]) {
    const buffer = this.createRainBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    let prevNode: AudioNode = source;
    for (const node of chain) {
      prevNode.connect(node);
      prevNode = node;
    }

    source.start(0);
    this.noiseNode = source;
  }

  // Soft occasional raindrops tapping on glass pane
  private startDropletSimulator(ctx: AudioContext) {
    if (this.dropletInterval) clearInterval(this.dropletInterval);

    this.dropletInterval = setInterval(() => {
      if (!this.isRunning || !this.masterGain || this.userMuted) return;
      if (Math.random() > 0.45) return;

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        const dropFilter = ctx.createBiquadFilter();

        dropFilter.type = 'bandpass';
        const freq = 750 + Math.random() * 800; // 750Hz to 1550Hz glassy droplet resonance
        dropFilter.frequency.setValueAtTime(freq, now);
        dropFilter.Q.setValueAtTime(6.0, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + 150, now);
        osc.frequency.exponentialRampToValueAtTime(freq - 100, now + 0.06);

        const dropVol = 0.04 + Math.random() * 0.05;
        dropGain.gain.setValueAtTime(dropVol, now);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.connect(dropFilter);
        dropFilter.connect(dropGain);
        dropGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {}
    }, 700);
  }

  public stop() {
    if (!this.isRunning) return;
    const ctx = getAudioContext();
    if (ctx && this.masterGain) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        setTimeout(() => {
          if (this.noiseNode) {
            try { this.noiseNode.stop(); } catch (e) {}
            this.noiseNode.disconnect();
            this.noiseNode = null;
          }
          this.isRunning = false;
        }, 1300);
      } catch (e) {
        this.isRunning = false;
      }
    } else {
      this.isRunning = false;
    }

    if (this.dropletInterval) {
      clearInterval(this.dropletInterval);
      this.dropletInterval = null;
    }
  }

  public toggle(force?: boolean): boolean {
    const shouldRun = force !== undefined ? force : !this.isRunning;
    if (shouldRun) {
      this.userMuted = false;
      this.start();
    } else {
      this.userMuted = true;
      this.stop();
    }
    return this.isRunning;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    const ctx = getAudioContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

export const rainASMR = new RainASMRManager();
