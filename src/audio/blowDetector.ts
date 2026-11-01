// Microphone Blow Detection for Birthday Cake Candles

export interface BlowDetectorHandle {
  stop: () => void;
}

export async function startBlowDetector(
  onBlow: () => void,
  onError: (err: unknown) => void
): Promise<BlowDetectorHandle | null> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    onError(new Error('Microphone not supported'));
    return null;
  }

  let stream: MediaStream | null = null;
  let audioCtx: AudioContext | null = null;
  let animId: number | null = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const source = audioCtx.createMediaStreamSource(stream);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioCtx.currentTime); // Low frequency for breath/puff

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.3;

    source.connect(filter);
    filter.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let consecutiveHits = 0;

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);

      // Average energy in low frequencies (bins 1 to 10)
      let sum = 0;
      const binCount = Math.min(12, dataArray.length);
      for (let i = 1; i < binCount; i++) {
        sum += dataArray[i];
      }
      const avg = sum / (binCount - 1);

      // Threshold for air puff
      if (avg > 65) {
        consecutiveHits++;
        if (consecutiveHits >= 3) {
          onBlow();
          consecutiveHits = 0;
        }
      } else {
        consecutiveHits = Math.max(0, consecutiveHits - 1);
      }

      animId = requestAnimationFrame(checkVolume);
    };

    checkVolume();

    return {
      stop: () => {
        if (animId) cancelAnimationFrame(animId);
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
        if (audioCtx && audioCtx.state !== 'closed') {
          audioCtx.close().catch(() => {});
        }
      }
    };
  } catch (err) {
    onError(err);
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    return null;
  }
}
