// Gentle Web Audio API synthesizer for ambient cues & SpeechSynthesis

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Calm, soft dual-tone chime (528Hz Solfeggio "clarity" frequency + harmonizing major third)
   */
  playGentleChime(type: "reconnect" | "saved" | "alert" | "recognition" = "reconnect") {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const baseFreq = type === "alert" ? 440 : type === "saved" ? 587.33 : 528;
      const secondFreq = type === "alert" ? 554.37 : type === "saved" ? 739.99 : 660;

      // Primary oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(baseFreq, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Harmonizing oscillator
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(secondFreq, now + 0.1);

      gain2.gain.setValueAtTime(0.001, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.12, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 1.3);

      osc2.start(now + 0.1);
      osc2.stop(now + 1.6);
    } catch (e) {
      console.warn("Audio playback not permitted or unavailable", e);
    }
  }

  /**
   * Speak gently using browser SpeechSynthesis
   */
  speakGentle(text: string, onEnd?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Calm, relaxed cadence
      utterance.pitch = 1.05;
      utterance.volume = 0.9;

      // Select a warm, natural sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Google") ||
            v.name.includes("Serena"))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable", e);
      if (onEnd) onEnd();
    }
  }

  stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundEngine();
