/**
 * Synthesised coastal ambience: rolling surf plus a slow steel-drum motif.
 *
 * Generated with the Web Audio API rather than shipping an audio file, so
 * there is no licensing question and nothing to download. To use a real track
 * instead, drop it in /public and replace `start()` with an <audio> element —
 * the rest of the interface (start/stop/setMuted) can stay the same.
 */

const PENTATONIC = [0, 2, 4, 7, 9, 12, 14, 16];
const ROOT_HZ = 261.63; // C4

function semitone(n: number): number {
  return ROOT_HZ * Math.pow(2, n / 12);
}

export class CoastalAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioScheduledSourceNode[] = [];
  private melodyTimer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  get isRunning(): boolean {
    return this.running;
  }

  /** Must be called from a user gesture — browsers block audio otherwise. */
  async start(volume = 0.4): Promise<void> {
    if (this.running) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    if (ctx.state === "suspended") await ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2.5);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.running = true;

    this.buildSurf();
    this.scheduleMelody();
  }

  /** Two noise layers: a deep swell and a brighter wash of breaking surf. */
  private buildSurf(): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const seconds = 4;
    const buffer = ctx.createBuffer(
      1,
      ctx.sampleRate * seconds,
      ctx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    // Brown-ish noise reads as water far better than white noise.
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const layers: { freq: number; q: number; gain: number; rate: number }[] = [
      { freq: 380, q: 0.7, gain: 0.55, rate: 0.09 },
      { freq: 1300, q: 0.5, gain: 0.22, rate: 0.13 },
    ];

    for (const layer of layers) {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = layer.freq;
      filter.Q.value = layer.q;

      const gain = ctx.createGain();
      gain.gain.value = layer.gain;

      // Slow LFO on the gain — this is what makes waves rise and fall.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = layer.rate;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = layer.gain * 0.7;
      lfo.connect(lfoDepth).connect(gain.gain);

      src.connect(filter).connect(gain).connect(master);
      src.start();
      lfo.start();
      this.nodes.push(src, lfo);
    }
  }

  /** A soft, unhurried pentatonic note every few seconds. */
  private scheduleMelody(): void {
    const play = () => {
      if (!this.running) return;
      this.pluck();
      const wait = 2200 + Math.random() * 3200;
      this.melodyTimer = setTimeout(play, wait);
    };
    this.melodyTimer = setTimeout(play, 1800);
  }

  private pluck(): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const note = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    const freq = semitone(note) * (Math.random() < 0.35 ? 2 : 1);
    const now = ctx.currentTime;

    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0, now);
    voice.gain.linearRampToValueAtTime(0.16, now + 0.02);
    voice.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

    // Two slightly detuned oscillators give it a steel-drum shimmer.
    for (const [type, detune, level] of [
      ["sine", 0, 1],
      ["triangle", 7, 0.4],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(voice);
      osc.start(now);
      osc.stop(now + 2.8);
    }

    // Cheap echo, for a sense of open air.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.38;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    delay.connect(feedback).connect(delay);

    voice.connect(master);
    voice.connect(delay).connect(master);
  }

  setVolume(volume: number): void {
    if (!this.ctx || !this.master) return;
    this.master.gain.linearRampToValueAtTime(
      volume,
      this.ctx.currentTime + 0.35,
    );
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
    this.melodyTimer = null;

    const ctx = this.ctx;
    const master = this.master;
    if (ctx && master) {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      await new Promise((r) => setTimeout(r, 700));
    }
    for (const node of this.nodes) {
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
    }
    this.nodes = [];
    await ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
