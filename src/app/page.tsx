'use client';

import { useWallet } from '@/context/WalletContext';
import { useState, useEffect, useRef } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

interface Fart {
  _id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploader: string;
  uploadDate: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  [key: string]: any; // Allow string indexing
}

export default function Home() {
  const { connected, walletAddress } = useWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fartName, setFartName] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [farts, setFarts] = useState<Fart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState({
    totalFarts: 0,
    activeUsers: 0,
    rewardsDistributed: '0 SOL'
  });
  const [page, setPage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 24;

  // Fetch farts and stats when component mounts or when connected status changes
  useEffect(() => {
    fetchFarts();
    fetchStats();
  }, [connected]);
  
  // Fetch stats from the database
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats({
          totalFarts: data.totalFarts || 0,
          activeUsers: data.totalUsers || 0,
          rewardsDistributed: '0 SOL' // Always set to 0 SOL for now
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFarts = async (resetPage = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      const response = await fetch(`/api/farts?limit=${ITEMS_PER_PAGE}&page=${currentPage}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch farts');
      }
      
      // Process the farts to add userVote if the user is connected
      const processedFarts = data.farts.map((fart: Fart) => {
        // In a real app, we would check if the user has voted on this fart
        // For now, we'll just set userVote to null
        return {
          ...fart,
          userVote: null
        };
      });
      
      if (resetPage) {
        setFarts(processedFarts);
        setPage(1);
      } else {
        setFarts([...farts, ...processedFarts]);
        setPage(currentPage + 1);
      }
      
      // Check if there are more farts to load
      setHasMore(data.pagination.total > currentPage * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching farts:', error);
      setError('Failed to fetch farts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadMore = () => {
    const nextPage = activeFilter ? filteredPage + 1 : page + 1;
    console.log(`Loading more farts, page ${nextPage}, filter: ${activeFilter || 'none'}`);
    
    if (activeFilter) {
      // For filtered results, use fetchFartsWithFilter
      fetchFartsWithFilter(activeFilter, false, nextPage);
    } else {
      // For unfiltered results, use fetchFarts
      fetchFarts(false);
    }
  };
  
  // Function to fetch more farts (used by loadMore)
  const fetchMoreFarts = async (url: string, nextPage: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch farts');
      }
      
      console.log(`Received ${data.farts.length} farts, total: ${data.pagination.total}`);
      console.log(`Current page: ${nextPage}, total pages: ${data.pagination.pages}`);
      
      // Process the farts to add userVote if the user is connected
      const processedFarts = data.farts.map((fart: Fart) => ({
        ...fart,
        userVote: null
      }));
      
      // Append new farts to the existing ones, filtering out duplicates
      setFarts(prev => {
        // Create a Set of existing fart IDs for quick lookup
        const existingIds = new Set(prev.map((fart: Fart) => fart._id));
        
        // Filter out any farts that already exist in the list
        const uniqueNewFarts = processedFarts.filter((fart: Fart) => !existingIds.has(fart._id));
        
        console.log(`Found ${uniqueNewFarts.length} unique new farts out of ${processedFarts.length} received`);
        
        return [...prev, ...uniqueNewFarts];
      });
      
      // Update correct page tracker
      if (activeFilter) {
        setFilteredPage(nextPage);
      } else {
        setPage(nextPage);
      }
      
      // Check if there are more farts to load
      setHasMore(data.pagination.total > nextPage * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching farts:', error);
      setError('Failed to fetch farts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // Don't auto-fill the name field
    }
  };
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filters = [
    "most recent",
    "most popular",
    "most disliked"
  ];
  
  // Function to fetch farts with filter
  const fetchFartsWithFilter = async (filter: string | null, resetPage = true, nextPage = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters based on filter
      const currentPage = resetPage ? 1 : (nextPage > 0 ? nextPage : filteredPage);
      let url = `/api/farts?limit=${ITEMS_PER_PAGE}&page=${currentPage}`;
      if (filter === 'most recent') {
        url += '&sort=date';
      } else if (filter === 'most popular') {
        url += '&sort=likes';
      } else if (filter === 'most disliked') {
        url += '&sort=dislikes';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch farts');
      }
      
      // Process the farts to add userVote if the user is connected
      const processedFarts = data.farts.map((fart: Fart) => ({
        ...fart,
        userVote: null
      }));
      
      if (resetPage) {
        // Reset the farts list when changing filters
        setFarts(processedFarts);
        setPage(1);
        setFilteredPage(1);
      } else {
        // Append new farts to the existing ones, filtering out duplicates
        setFarts(prev => {
          // Create a Set of existing fart IDs for quick lookup
          const existingIds = new Set(prev.map((fart: Fart) => fart._id));
          
          // Filter out any farts that already exist in the list
          const uniqueNewFarts = processedFarts.filter((fart: Fart) => !existingIds.has(fart._id));
          
          console.log(`Found ${uniqueNewFarts.length} unique new farts out of ${processedFarts.length} received`);
          
          return [...prev, ...uniqueNewFarts];
        });
        setFilteredPage(currentPage);
      }
      
      // Check if there are more farts to load
      setHasMore(data.pagination.total > currentPage * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching farts:', error);
      setError('Failed to fetch farts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update filter handler
  const handleFilterChange = (filter: string) => {
    const newFilter = activeFilter === filter ? null : filter;
    setActiveFilter(newFilter);
    fetchFartsWithFilter(newFilter);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setFartName('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !fartName) {
      alert('Please select a file and provide a name for your fart.');
      return;
    }
    
    if (!connected || !walletAddress) {
      setVoteError('Please connect your wallet to upload a fart.');
      closeModal();
      return;
    }
    
    closeModal();
    setUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Upload the file
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload file');
      }
      
      // Save the fart in the database
      const saveResponse = await fetch('/api/farts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fartName,
          fileName: uploadData.fileName,
          fileUrl: uploadData.fileUrl,
          uploader: walletAddress,
        }),
      });
      
      const saveData = await saveResponse.json();
      
      if (!saveResponse.ok) {
        throw new Error(saveData.error || 'Failed to save fart');
      }
      
      // Add the new fart to the list
      setFarts([{
        ...saveData.fart,
        userVote: null
      }, ...farts]);
      
      // Clear the selected file
      setSelectedFile(null);
      
      // Refresh the fart list
      fetchFarts();
    } catch (error) {
      console.error('Error uploading fart:', error);
      setError('Failed to upload fart. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleVote = async (fartId: string, vote: 'like' | 'dislike') => {
    if (!connected || !walletAddress) return;
    
    try {
      // Optimistically update the UI
      setFarts(farts.map(fart => {
        if (fart._id === fartId) {
          // If user already voted the same way, remove the vote
          if (fart.userVote === vote) {
            const updatedFart = { ...fart };
            updatedFart.userVote = null;
            
            // Handle likes/dislikes
            if (vote === 'like') {
              updatedFart.likes -= 1;
            } else {
              updatedFart.dislikes -= 1;
            }
            
            return updatedFart;
          }
          
          // If user voted differently before, switch the vote
          if (fart.userVote) {
            const updatedFart = { ...fart };
            
            // Remove old vote
            if (fart.userVote === 'like') {
              updatedFart.likes -= 1;
            } else {
              updatedFart.dislikes -= 1;
            }
            
            // Add new vote
            if (vote === 'like') {
              updatedFart.likes += 1;
            } else {
              updatedFart.dislikes += 1;
            }
            
            updatedFart.userVote = vote;
            return updatedFart;
          }
          
          // If user hasn't voted before
          const updatedFart = { ...fart };
          if (vote === 'like') {
            updatedFart.likes += 1;
          } else {
            updatedFart.dislikes += 1;
          }
          updatedFart.userVote = vote;
          return updatedFart;
        }
        return fart;
      }));
      
      // Send the vote to the server
      const response = await fetch('/api/farts/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fartId,
          walletAddress,
          vote,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to vote');
      }
      
      // If needed, update the UI with the server response
      // This ensures the UI is in sync with the server
      setFarts(farts.map(fart => {
        if (fart._id === fartId) {
          return {
            ...fart,
            likes: data.fart.likes,
            dislikes: data.fart.dislikes,
            userVote: data.fart.userVote
          };
        }
        return fart;
      }));
    } catch (error) {
      console.error('Error voting:', error);
      // Revert the optimistic update
      fetchFarts();
    }
  };

  return (
    <div className="min-h-screen bg-[#363636] text-white flex flex-col">
      <div className="mt-10 mb-4 text-center">
        <p className="text-gray-300 text-sm">decentralized fart-to-earn protocol.</p>
        <p className="text-gray-300 text-sm">upload your best farts, earn votes, win sol. powered by cheeks, judged by the crowd.</p>
        
        <div className="max-w-md mx-auto my-4">
          <AudioPlayer 
            src="/api/featured-audio" 
            title="Featured Audio Track" 
            className="shadow-lg"
          />
        </div>
        
        <div className="flex justify-center space-x-8 mt-2">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#e7d61b]">{stats.totalFarts}</span>
            <span className="text-gray-400 text-xs">TOTAL FARTS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#e7d61b]">{stats.rewardsDistributed}</span>
            <span className="text-gray-400 text-xs">REWARDS DISTRIBUTED</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#e7d61b]">{stats.activeUsers}</span>
            <span className="text-gray-400 text-xs">ACTIVE USERS</span>
          </div>
        </div>
        
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-gray-300 text-xs mb-2">
            help support the development of the fart2earn protocol:
          </p>
          <div className="bg-[#2a2a2a] p-3 rounded-md mb-2 mx-auto">
            <p className="text-[#e7d61b] text-xs font-mono break-all select-all">
              EjcZMQiUFonJErgeXzHv9rQf2BUPUR5JCXa42PF97uXr
            </p>
          </div>
          <p className="text-gray-300 text-xs">
            your contributions help us improve the platform and add new features that may otherwise be paywalled
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-none flex-grow flex flex-col p-8">
        <div className="w-full">
          {/* Upload button - visible to everyone */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={openModal}
              className="bg-transparent hover:bg-[#2a2a2a] text-[#e7d61b] py-1 px-3 text-xs lowercase tracking-wider border border-[#e7d61b] transition-all duration-200 cursor-pointer"
            >
              upload fart mp3
            </button>
          </div>
          
          {/* Upload Modal */}
          {isModalOpen && (
            <div 
              className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <div 
                className="bg-[#2a2a2a] p-8 rounded-lg w-full max-w-md border border-[#444] shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#e7d61b]">upload your fart</h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-[#e7d61b] text-2xl font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#e7d61b] mb-2 font-medium lowercase">fart name</label>
                  <input
                    type="text"
                    value={fartName}
                    onChange={(e) => setFartName(e.target.value)}
                    className="w-full p-3 bg-[#333] rounded border border-[#444] text-white focus:border-[#e7d61b] focus:outline-none transition-colors"
                    placeholder="give your fart a name"
                  />
                </div>
                
                {/* Fart Type dropdown removed as requested */}
                
                <div className="mb-8">
                  <label className="block text-[#e7d61b] mb-2 font-medium lowercase">audio file</label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/mp3,audio/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="w-full p-3 bg-[#333] rounded border border-[#444] text-gray-300 flex items-center justify-between cursor-pointer hover:border-[#e7d61b] transition-colors"
                    >
                      <span className="truncate">
                        {selectedFile ? selectedFile.name : 'choose audio file'}
                      </span>
                      <span className="bg-[#444] py-1 px-3 rounded text-xs ml-2">browse</span>
                    </label>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-[#e7d61b]">selected: {selectedFile.name}</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="bg-transparent hover:bg-[#333] text-gray-300 border border-[#444] py-2 px-6 transition-colors cursor-pointer lowercase"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || !fartName || uploading}
                    className="bg-[#e7d61b] hover:bg-[#c9ba17] text-black py-2 px-6 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer lowercase"
                  >
                    {uploading ? 'uploading...' : 'upload fart'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          
          {/* Fart list - visible to everyone */}
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">fart collection</h2>
            
            {/* Filters on the left */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`py-2 px-4 text-xs font-bold lowercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                      activeFilter === filter 
                        ? 'bg-[#e7d61b] text-black' 
                        : 'bg-transparent hover:bg-[#2a2a2a] text-[#e7d61b] border border-[#e7d61b]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Vote error message */}
            {voteError && (
              <div className="mb-4 text-red-500 text-center text-sm">
                {voteError}
              </div>
            )}
            
            {loading ? (
              <p className="text-gray-400 text-center py-8">Loading farts...</p>
            ) : error ? (
              <div className="text-red-400 text-center py-8">
                <p>{error}</p>
                <button 
                  onClick={() => fetchFarts(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : farts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No farts uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {farts.map(fart => (
                    <div key={fart._id} className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg border border-[#444] flex flex-col">
                      <div className="p-3 flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-white text-sm">
                            {fart.name.length > 20 ? fart.name.substring(0, 20) + '...' : fart.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                if (connected) {
                                  handleVote(fart._id, 'like');
                                  setVoteError(null);
                                } else {
                                  setVoteError('Please connect your wallet to vote.');
                                }
                              }}
                              className={`flex items-center space-x-1 cursor-pointer ${
                                !connected ? 'opacity-50' : 
                                fart.userVote === 'like' ? 'text-green-500' : 'text-gray-400'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                              </svg>
                              <span className="ml-1 text-xs">{fart.likes}</span>
                            </button>
                            <button
                              onClick={() => {
                                if (connected) {
                                  handleVote(fart._id, 'dislike');
                                  setVoteError(null);
                                } else {
                                  setVoteError('Please connect your wallet to vote.');
                                }
                              }}
                              className={`flex items-center space-x-1 cursor-pointer ${
                                !connected ? 'opacity-50' : 
                                fart.userVote === 'dislike' ? 'text-red-500' : 'text-gray-400'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55v4c0 .25.218.5.554.55 1.1.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                              </svg>
                              <span className="ml-1 text-xs">{fart.dislikes}</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1 text-xs text-gray-400 mb-2">
                          <p>By: {fart.uploader.slice(0, 4)}...{fart.uploader.slice(-4)}</p>
                          <p className="text-[#e7d61b]/70">
                            {new Date(fart.uploadDate).toLocaleDateString()} • {new Date(fart.uploadDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        
                        <div className="rounded p-2 flex items-center">
                          <audio 
                            id={`audio-${fart._id}`} 
                            src={fart.fileUrl} 
                            className="hidden"
                          />
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
                            className="w-7 h-7 flex items-center justify-center bg-transparent text-white border border-gray-600 rounded-full mr-2 hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="play-icon">
                              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="pause-icon hidden">
                              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                          </button>
                          <div className="flex-grow">
                            <div className="text-xs text-gray-300 truncate max-w-[80px]">
                              {/* Show audio duration instead of filename */}
                              <span className="text-xs">0:15</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Load More button */}
                {hasMore && !loading && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => loadMore()}
                      className="bg-transparent hover:bg-[#2a2a2a] text-[#e7d61b] py-2 px-4 text-xs lowercase tracking-wider border border-[#e7d61b] transition-all duration-200 cursor-pointer"
                    >
                      load more farts
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
