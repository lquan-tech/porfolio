"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Music } from "lucide-react"

interface Track {
  id: number
  title: string
  artist: string
  duration: number
  url: string
  cover: string
}

const defaultTracks: Track[] = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "Artist Name",
    duration: 240,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "/summer-music-album.jpg",
  },
  {
    id: 2,
    title: "Night Drive",
    artist: "Another Artist",
    duration: 200,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "/night-music-album.jpg",
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Chill Beats",
    duration: 220,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "/ocean-music-album.jpg",
  },
  {
    id: 4,
    title: "Mountain Peak",
    artist: "Folk Artist",
    duration: 260,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "/mountain-music-album.jpg",
  },
  {
    id: 5,
    title: "City Lights",
    artist: "Urban Sound",
    duration: 210,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "/city-music-album.jpg",
  },
]

const MusicPlayer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [tracks] = useState<Track[]>(defaultTracks)
  const [isShowingPlaylist, setIsShowingPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = tracks[currentTrackIndex]

  // Handle audio time update
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      handleNext()
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrackIndex])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch((err) => console.log("Play error:", err))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = 0
    } else {
      audio.volume = volume / 100
    }
  }, [volume, isMuted])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio ref={audioRef} src={currentTrack.url} crossOrigin="anonymous" />
      <AnimatePresence mode="wait">
        {isExpanded ? (
            // Expanded Player
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-0 right-0 w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 dark:border-cyan-600/30 backdrop-blur-xl"
            >
              {/* Album Art */}
              <motion.div
                className="relative h-64 bg-gradient-to-br from-cyan-400 to-blue-600 overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={currentTrack.cover || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/30 to-cyan-500/0 pointer-events-none"
                />
              </motion.div>

              {/* Song Info */}
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white truncate">{currentTrack.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={currentTrack.duration}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    className="p-2 hover:bg-cyan-500/20 rounded-full transition-colors"
                    title="Previous track"
                  >
                    <SkipBack className="w-5 h-5 text-cyan-400" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayPause}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-full transition-all"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="p-2 hover:bg-cyan-500/20 rounded-full transition-colors"
                    title="Next track"
                  >
                    <SkipForward className="w-5 h-5 text-cyan-400" />
                  </motion.button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 hover:bg-cyan-500/20 rounded-full transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-cyan-400" />
                      )}
                    </motion.button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value))
                        if (isMuted) setIsMuted(false)
                      }}
                      className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
                      title="Volume"
                    />
                    <span className="text-xs text-gray-500 w-8 text-right">{volume}%</span>
                  </div>
                </div>

                {/* Playlist Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsShowingPlaylist(!isShowingPlaylist)}
                  className="w-full py-2 mt-2 border-t border-gray-700 text-gray-400 hover:text-cyan-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4" />
                  Playlist
                </motion.button>

                {/* Collapse Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(false)}
                  className="w-full py-2 mt-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronDown className="w-4 h-4" />
                  Collapse
                </motion.button>
              </div>

              {/* Playlist Popup */}
              {isShowingPlaylist && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-full bottom-0 mb-2 mr-4 w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur-xl"
              >
                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Playlist</p>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {tracks.map((track, index) => (
                      <motion.button
                        key={track.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setCurrentTrackIndex(index)
                          setCurrentTime(0)
                          setIsPlaying(true)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          index === currentTrackIndex
                            ? "bg-cyan-500/30 text-cyan-300 font-medium"
                            : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <div className="truncate">{track.title}</div>
                        <div className="text-xs opacity-75 truncate">{track.artist}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
              )}
            </motion.div>
          ) : (
            // Compact Player
            <motion.div
              key="compact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 30 }}
              className="flex flex-col gap-3"
            >
              {/* Mini Player */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl hover:shadow-2xl transition-shadow border-2 border-cyan-300/50 flex items-center justify-center relative overflow-hidden group"
                title="Open music player"
              >
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="relative z-10"
                >
                  {isPlaying ? (
                    <div className="flex gap-1 items-center justify-center h-6">
                      <motion.div
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                        className="w-1 bg-white rounded-full"
                      />
                      <motion.div
                        animate={{ height: [12, 20, 12] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
                        className="w-1 bg-white rounded-full"
                      />
                      <motion.div
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                        className="w-1 bg-white rounded-full"
                      />
                    </div>
                  ) : (
                    <Music className="w-6 h-6 text-white" />
                  )}
                </motion.div>
              </motion.button>

              {/* Info Tooltip */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute bottom-16 right-0 bg-gray-900/90 backdrop-blur text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
              >
                <div className="font-medium truncate max-w-xs">{currentTrack.title}</div>
                <div className="text-gray-400 truncate">{currentTrack.artist}</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  )
}

export default MusicPlayer
