/**
 * MuseumAudioEngine — Sistem Audio Prosedural Web Audio API (0 ms Latensi)
 *
 * Menyediakan:
 * 1. Unlock AudioContext resmi saat interaksi pertama pengguna (mematuhi Autoplay Policy)
 * 2. BGM (Musik Latar Belakang) ambient pad orkestra lembut bernuansa museum
 * 3. SFX Prosedural: hover, masuk/keluar pintu ruangan, buka/tutup modal, dan klik UI
 */

type AudioListener = (muted: boolean) => void

class MuseumAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private bgmGain: GainNode | null = null
  private bgmNodes: AudioNode[] = []
  private bgmInterval: number | null = null
  private isBgmPlaying = false
  private muted = false
  private listeners = new Set<AudioListener>()
  private lastHoverTime = 0

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return null
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this.muted ? 0 : 1
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  /** Membuka kunci AudioContext peramban secara sah pada klik pertama */
  public unlock(): void {
    this.ensureContext()
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setMuted(nextMuted: boolean): void {
    this.muted = nextMuted
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setTargetAtTime(nextMuted ? 0 : 1, now, 0.08)
    }
    this.listeners.forEach((fn) => fn(this.muted))
  }

  public toggleMute(): boolean {
    this.ensureContext()
    this.setMuted(!this.muted)
    return this.muted
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Memulai BGM ambient museum lembut (pad harmonis berwibawa) */
  public startBgm(): void {
    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain || this.isBgmPlaying) return

    this.isBgmPlaying = true
    const bgmGain = ctx.createGain()
    bgmGain.gain.setValueAtTime(0.0001, ctx.currentTime)
    bgmGain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 2.4)

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 420
    lowpass.Q.value = 0.7

    bgmGain.connect(lowpass)
    lowpass.connect(this.masterGain)

    this.bgmGain = bgmGain

    // Progresi nada hangat museum (C3, G3, D4, E4, B3)
    const chords: number[][] = [
      [130.81, 196.0, 293.66, 329.63], // Cmaj9
      [110.0, 164.81, 246.94, 329.63], // Am9
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0],  // G6
    ]

    const oscs: OscillatorNode[] = []
    const oscGains: GainNode[] = []

    chords[0].forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      osc.detune.value = (idx - 1.5) * 4
      g.gain.value = idx === 0 ? 0.36 : 0.2

      osc.connect(g)
      g.connect(bgmGain)
      osc.start()

      oscs.push(osc)
      oscGains.push(g)
    })

    this.bgmNodes = [...oscs, ...oscGains, bgmGain, lowpass]

    let chordIndex = 0
    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || !this.isBgmPlaying) return
      chordIndex = (chordIndex + 1) % chords.length
      const nextChord = chords[chordIndex]
      const now = this.ctx.currentTime
      oscs.forEach((osc, i) => {
        osc.frequency.setTargetAtTime(nextChord[i], now, 1.4)
      })
    }, 6500)
  }

  public stopBgm(): void {
    this.isBgmPlaying = false
    if (this.bgmInterval !== null) {
      window.clearInterval(this.bgmInterval)
      this.bgmInterval = null
    }
    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime
      this.bgmGain.gain.cancelScheduledValues(now)
      this.bgmGain.gain.setTargetAtTime(0.0001, now, 0.25)
    }
    const nodesToStop = [...this.bgmNodes]
    this.bgmNodes = []
    this.bgmGain = null
    window.setTimeout(() => {
      nodesToStop.forEach((node) => {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          try {
            ;(node as OscillatorNode).stop()
          } catch {
            // ignore already stopped
          }
        }
        try {
          node.disconnect()
        } catch {
          // ignore
        }
      })
    }, 450)
  }

  /** SFX: Hover pintu atau bingkai pameran */
  public playHover(): void {
    const nowMs = performance.now()
    if (nowMs - this.lastHoverTime < 110) return
    this.lastHoverTime = nowMs

    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain || this.muted) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(760, now)
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.065)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.035, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.09)
  }

  /** SFX: Klik tombol UI / lanjut intro */
  public playUiClick(): void {
    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain || this.muted) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.055)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.075, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.08)
  }

  /** SFX: Masuk atau keluar pintu ruangan sub-bab (whoosh lembut + chime hangat) */
  public playDoorTransition(): void {
    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain || this.muted) return

    const now = ctx.currentTime

    // 1. Soft filtered whoosh
    const bufferSize = Math.floor(ctx.sampleRate * 0.45)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(280, now)
    filter.frequency.exponentialRampToValueAtTime(920, now + 0.22)
    filter.frequency.exponentialRampToValueAtTime(340, now + 0.44)
    filter.Q.value = 1.2

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.001, now)
    noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.14)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    noise.start(now)

    // 2. Warm transition chime
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, now + 0.05) // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.25) // E5

    oscGain.gain.setValueAtTime(0.0001, now + 0.05)
    oscGain.gain.linearRampToValueAtTime(0.06, now + 0.1)
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)

    osc.connect(oscGain)
    oscGain.connect(this.masterGain)
    osc.start(now + 0.05)
    osc.stop(now + 0.52)
  }

  /** SFX: Membuka modal informasi arsip/tokoh */
  public playModalOpen(): void {
    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain || this.muted) return

    const now = ctx.currentTime
    const notes = [587.33, 880.0] // D5 -> A5

    notes.forEach((freq, i) => {
      const start = now + i * 0.075
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.linearRampToValueAtTime(0.065, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32)

      osc.connect(gain)
      gain.connect(this.masterGain!)
      osc.start(start)
      osc.stop(start + 0.35)
    })
  }

  /** SFX: Menutup modal informasi arsip/tokoh */
  public playModalClose(): void {
    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain || this.muted) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(659.25, now)
    osc.frequency.exponentialRampToValueAtTime(440.0, now + 0.14)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.05, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + 0.2)
  }
}

export const museumAudio = new MuseumAudioEngine()
