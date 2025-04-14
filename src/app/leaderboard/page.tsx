'use client';

import { useState, useEffect, useCallback } from 'react';

interface Fart {
  _id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploader: string;
  uploadDate: string;
  likes: number;
  dislikes: number;
}

export default function Leaderboard() {
  const [topFarts, setTopFarts] = useState<Fart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<{days: number, hours: number, minutes: number, seconds: number}>({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Available weeks for the selector
  const weeks = [1, 2, 3, 4];
  
  // Set end date to 7 days from now
  const weekOneEndDate = new Date();
  weekOneEndDate.setDate(weekOneEndDate.getDate() + 7);
  weekOneEndDate.setHours(23, 59, 59, 999);

  // Calculate time remaining
  const calculateTimeRemaining = useCallback(() => {
    const now = new Date();
    const difference = weekOneEndDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    setTimeRemaining({ days, hours, minutes, seconds });
  }, []);
  
  useEffect(() => {
    fetchTopFarts();
    
    // Update timer every second
    const timer = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();
    
    return () => clearInterval(timer);
  }, [selectedWeek, calculateTimeRemaining]);

  const fetchTopFarts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch top 10 farts by likes
      const response = await fetch('/api/farts?sort=likes&limit=10');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch top farts');
      }
      
      setTopFarts(data.farts);
    } catch (error) {
      console.error('Error fetching top farts:', error);
      setError('Failed to fetch leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return formatted.toLowerCase();
  };

  // Calculate reward based on position
  const getReward = (position: number) => {
    // Start with 100 SOL for 1st place and decrease gradually to 10 SOL for 10th place
    const rewards = [100, 80, 65, 55, 45, 35, 25, 20, 15, 10];
    return rewards[position] || 10;
  };

  // Generate farts for the leaderboard based on selected week
  const getLeaderboardFarts = () => {
    // Only show actual data for week 1
    if (selectedWeek === 1) {
      if (topFarts.length >= 10) {
        return topFarts.slice(0, 10);
      }
      
      // Create placeholder farts to fill up to 10 spots
      const placeholders = Array(10 - topFarts.length).fill(0).map((_, index) => ({
        _id: `placeholder-${index}`,
        name: '---',
        fileName: '',
        fileUrl: '',
        uploader: '---',
        uploadDate: '',
        likes: 0,
        dislikes: 0,
        isPlaceholder: true
      }));
      
      return [...topFarts, ...placeholders];
    } else {
      // For other weeks, show all placeholders
      return Array(10).fill(0).map((_, index) => ({
        _id: `placeholder-week${selectedWeek}-${index}`,
        name: '---',
        fileName: '',
        fileUrl: '',
        uploader: '---',
        uploadDate: '',
        likes: 0,
        dislikes: 0,
        isPlaceholder: true
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#363636] text-white flex flex-col">
      <div className="mt-20 mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#e7d61b]">fart leaderboard</h1>
        <p className="text-gray-300 mt-2">top 10 most popular farts</p>
        
        {/* Timer for week 1 */}
        {selectedWeek === 1 && (
          <div className="mt-4 text-xs">
            <p className="text-gray-300">week 1 ends in:</p>
            <div className="text-[#e7d61b] font-mono">
              {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
            </div>
          </div>
        )}
        
        {/* Week selector */}
        <div className="mt-6">
          <div className="flex justify-center space-x-2">
            {weeks.map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`py-2 px-4 text-xs font-bold lowercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  selectedWeek === week 
                    ? 'bg-[#e7d61b] text-black' 
                    : 'bg-transparent hover:bg-[#2a2a2a] text-[#e7d61b] border border-[#e7d61b]'
                }`}
              >
                week {week}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col p-8">
        {error ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-red-400 text-center">
              <p>{error}</p>
              <button 
                onClick={fetchTopFarts}
                className="mt-4 bg-[#e7d61b] hover:bg-[#c9ba17] text-black py-2 px-4 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : topFarts.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400">No farts have been uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-[#444]">
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">rank</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">name</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">uploader</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">likes</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">dislikes</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">date</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">reward</th>
                  <th className="py-3 px-4 text-left text-[#e7d61b] text-xs">play</th>
                </tr>
              </thead>
              <tbody>
                {getLeaderboardFarts().map((fart, index) => (
                  <tr 
                    key={fart._id} 
                    className={`border-b border-[#444] ${index % 2 === 0 ? 'bg-[#2a2a2a]' : 'bg-[#333]'}`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#e7d61b] text-xs">#{index + 1}</span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {loading && !('isPlaceholder' in fart) ? 
                        <span className="text-gray-500">loading...</span> : 
                        typeof fart.name === 'string' ? fart.name.toLowerCase() : fart.name}
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-xs">
                      {loading && !('isPlaceholder' in fart) ? 
                        <span className="text-gray-500">loading...</span> : 
                        'isPlaceholder' in fart ? '-' : `${fart.uploader.slice(0, 4)}...${fart.uploader.slice(-4)}`}
                    </td>
                    <td className="py-3 px-4 text-green-500 text-xs">
                      {loading && !('isPlaceholder' in fart) ? 
                        <span className="text-gray-500">...</span> : 
                        fart.likes}
                    </td>
                    <td className="py-3 px-4 text-red-500 text-xs">
                      {loading && !('isPlaceholder' in fart) ? 
                        <span className="text-gray-500">...</span> : 
                        fart.dislikes}
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-xs">
                      {loading && !('isPlaceholder' in fart) ? 
                        <span className="text-gray-500">loading...</span> : 
                        'isPlaceholder' in fart ? '-' : formatDate(fart.uploadDate)}
                    </td>
                    <td className="py-3 px-4 text-[#e7d61b] font-bold text-xs">
                      {loading && !('isPlaceholder' in fart) ? 
                        <span className="text-gray-500">loading...</span> : 
                        `${getReward(index)} sol`}
                    </td>
                    <td className="py-3 px-4">
                      {loading && !('isPlaceholder' in fart) ? (
                        <span className="text-gray-500">loading...</span>
                      ) : !('isPlaceholder' in fart) ? (
                        <>
                          <audio id={`audio-${fart._id}`} src={fart.fileUrl} className="hidden" />
                          <button 
                            onClick={(e) => {
                          const audio = document.getElementById(`audio-${fart._id}`) as HTMLAudioElement;
                          const button = e.currentTarget;
                          const playIcon = button.querySelector('.play-icon');
                          const pauseIcon = button.querySelector('.pause-icon');
                          
                          if (audio.paused) {
                            audio.play();
                            if (playIcon && pauseIcon) {
                              playIcon.classList.add('hidden');
                              pauseIcon.classList.remove('hidden');
                            }
                          } else {
                            audio.pause();
                            if (playIcon && pauseIcon) {
                              playIcon.classList.remove('hidden');
                              pauseIcon.classList.add('hidden');
                            }
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-transparent text-white border border-gray-600 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="play-icon">
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="pause-icon hidden">
                          <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                        </svg>
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
