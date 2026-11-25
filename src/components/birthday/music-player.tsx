import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Music2, Pause, Play, Volume2, VolumeX, Upload, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config";

type SavedSong = { file: Blob; name: string };
async function songStore(
  action: "read" | "write" | "delete",
  song?: SavedSong,
): Promise<SavedSong | undefined> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("birthday-universe-music", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("songs");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction("songs", action === "read" ? "readonly" : "readwrite");
      const store = transaction.objectStore("songs");
      const request =
        action === "read"
          ? store.get("chosen")
          : action === "delete"
            ? store.delete("chosen")
            : store.put(song, "chosen");
      transaction.oncomplete = () =>
        resolve(action === "read" ? (request.result as SavedSong | undefined) : undefined);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [src, setSrc] = useState(config.musicSrc);
  const [name, setName] = useState(
    config.musicSrc ? "Your birthday soundtrack" : "A soundtrack for this moment",
  );
  const [uploaded, setUploaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    try {
      const saved = JSON.parse(localStorage.getItem("birthday-audio-prefs") ?? "null") as {
        volume?: number;
        muted?: boolean;
      } | null;
      if (typeof saved?.volume === "number") setVolume(Math.max(0, Math.min(1, saved.volume)));
      if (typeof saved?.muted === "boolean") setMuted(saved.muted);
    } catch {
      /* Browser storage can be unavailable. Defaults remain usable. */
    }
    void songStore("read")
      .then((song) => {
        if (!active || !song) return;
        const url = URL.createObjectURL(song.file);
        objectUrl.current = url;
        setSrc(url);
        setName(song.name);
        setUploaded(true);
      })
      .catch(() => {
        if (active) setNotice("Songs can still play here, but this browser may not remember them.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);
  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
      audio.current.muted = muted;
    }
    if (!loading) {
      try {
        localStorage.setItem("birthday-audio-prefs", JSON.stringify({ volume, muted }));
      } catch {
        /* Use session preferences. */
      }
    }
  }, [volume, muted, loading]);
  useEffect(() => {
    if (loading || !src || playing) return;
    let active = true;
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const cleanup = () => {
      events.forEach((event) => window.removeEventListener(event, tryPlay));
    };
    async function tryPlay() {
      const element = audio.current;
      if (!active || !element) return;
      try {
        await element.play();
        cleanup();
      } catch {
        // Browsers may require a user gesture before playing with sound.
      }
    }
    events.forEach((event) => window.addEventListener(event, tryPlay));
    void tryPlay();
    return () => {
      active = false;
      cleanup();
    };
  }, [loading, playing, src]);
  async function play() {
    if (!src) {
      input.current?.click();
      return;
    }
    if (playing) {
      audio.current?.pause();
      return;
    }
    try {
      await audio.current?.play();
      setNotice("");
    } catch {
      setNotice("This song couldn't play. Try another audio file.");
    }
  }
  async function choose(file: File | undefined) {
    if (!file) return;
    if (file.type && !file.type.startsWith("audio/")) {
      setNotice("Please choose an audio file.");
      return;
    }
    audio.current?.pause();
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    // Commit the new source before playing so React cannot interrupt playback
    // by reapplying the src attribute after the user's upload gesture.
    flushSync(() => {
      setSrc(url);
      setName(file.name);
      setUploaded(true);
      setNotice("");
    });
    const element = audio.current;
    if (element) {
      element.load();
      try {
        await element.play();
      } catch {
        setNotice("Tap play to start your song, or choose another audio file.");
      }
    }
    try {
      await songStore("write", { file, name: file.name });
    } catch {
      setNotice("Your song is ready, but couldn't be saved for next time.");
    }
  }
  async function remove() {
    audio.current?.pause();
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setUploaded(false);
    setSrc(config.musicSrc);
    setName(config.musicSrc ? "Your birthday soundtrack" : "A soundtrack for this moment");
    setNotice("");
    try {
      await songStore("delete");
    } catch {
      setNotice("Couldn't remove the saved song. Please try again.");
    }
  }
  return (
    <aside className="music-player" aria-label="Music player">
      <audio
        ref={audio}
        src={src || undefined}
        loop
        autoPlay
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setSrc("");
          setNotice("Add a song to make this moment yours.");
        }}
      />
      <input
        ref={input}
        type="file"
        accept="audio/*"
        className="sr-only"
        aria-label="Choose your song"
        onChange={(event) => {
          void choose(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {expanded && (
        <div className="music-panel">
          <div className="music-panel-heading">
            <span className="eyebrow">THE SOUNDTRACK</span>
            <Button
              variant="tool"
              size="icon"
              aria-label="Close music panel"
              onClick={() => setExpanded(false)}
            >
              <X />
            </Button>
          </div>
          <p className="song-name">{loading ? "Finding your song…" : name}</p>
          <p className="music-note">
            {src ? "A little music, a little magic." : "Every universe deserves a song."}
          </p>
          <div className="playback-controls">
            <Button
              variant="surprise"
              size="icon"
              aria-label={playing ? "Pause song" : src ? "Play song" : "Add a song"}
              disabled={loading}
              onClick={() => void play()}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
            <div className={`equalizer ${playing ? "playing" : ""}`} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} />
              ))}
            </div>
            <Button
              variant="tool"
              size="icon"
              aria-label={muted ? "Unmute song" : "Mute song"}
              aria-pressed={muted}
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
          <label className="volume-label" htmlFor="song-volume">
            Volume <span>{Math.round(volume * 100)}%</span>
          </label>
          <input
            id="song-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
          <div className="song-actions">
            <Button
              variant="quiet"
              size="sm"
              disabled={loading}
              onClick={() => input.current?.click()}
            >
              <Upload />
              Add your song
            </Button>
            {uploaded && (
              <Button
                variant="tool"
                size="icon"
                aria-label="Remove song"
                title="Remove song"
                onClick={() => void remove()}
              >
                <Trash2 />
              </Button>
            )}
          </div>
          {notice && (
            <p className="music-status" role="status">
              {notice}
            </p>
          )}
        </div>
      )}
      <Button
        variant="tool"
        className={`music-trigger ${playing ? "has-song" : ""}`}
        aria-label={expanded ? "Hide music player" : "Open music player"}
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <Music2 />
        <span>{playing ? "a little soundtrack" : "a little music?"}</span>
        <span className="music-dot" />
      </Button>
    </aside>
  );
}
