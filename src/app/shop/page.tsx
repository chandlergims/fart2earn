'use client';

import { useWallet } from '@/context/WalletContext';
import { useState } from 'react';

interface FartProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  audioSrc: string;
  seller: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export default function Shop() {
  const { connected } = useWallet();
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Sample fart products
  const fartProducts: FartProduct[] = [
    {
      id: '1',
      name: 'Wet Ripper',
      description: 'Juicy and resonant. Sounds like you need to check your pants.',
      price: '0.05 SOL',
      audioSrc: '',
      seller: '7xGa...4Pqr',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Cheek Clapper',
      description: 'Thunderous and powerful. Will assert dominance in any room.',
      price: '0.15 SOL',
      audioSrc: '',
      seller: '3jKm...9Lzx',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Silent But Deadly',
      description: 'Barely audible but packs a punch. The ninja of farts.',
      price: '0.08 SOL',
      audioSrc: '',
      seller: '5tNb...2Wqy',
      rarity: 'uncommon'
    },
    {
      id: '4',
      name: 'The Shart Master',
      description: 'Not for the faint of heart. May require a change of underwear.',
      price: '0.25 SOL',
      audioSrc: '',
      seller: '9pRs...6Fvt',
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const handleBuyClick = () => {
    setShowComingSoon(true);
  };

  return (
    <div className="min-h-screen bg-[#363636] text-white flex flex-col">
      <div className="w-full p-8">
        <h1 className="text-xl font-bold mb-2 text-[#e7d61b]">fart marketplace</h1>
        <p className="text-gray-300 mb-8 text-sm">buy, sell, and trade premium ass sounds. earn while you burn.</p>
        
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fartProducts.map((product) => (
            <div key={product.id} className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#444] flex flex-col">
              <div className="p-2 flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-white text-xs">{product.name.toLowerCase()}</h3>
                  <span className={`text-xs font-medium ${getRarityColor(product.rarity)}`}>
                    {product.rarity.toLowerCase()}
                  </span>
                </div>
                
                <p className="text-gray-400 text-xs mb-2">{product.description.toLowerCase()}</p>
                
                <div className="mb-2">
                  <div className="bg-[#363636] rounded p-1 flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center bg-[#e7d61b] text-black rounded-full mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                    </div>
                    <div className="text-xs text-gray-300">
                      preview coming soon
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">seller: {product.seller.toLowerCase()}</p>
                    <p className="text-xs font-bold text-[#e7d61b]">{product.price.toLowerCase()}</p>
                  </div>
                  
                  <button
                    onClick={handleBuyClick}
                    className="bg-transparent hover:bg-[#363636] text-[#e7d61b] border border-[#e7d61b] px-2 py-1 text-xs rounded transition-colors"
                  >
                    buy now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-[#2a2a2a] rounded-lg p-4 border border-[#444]">
          <h2 className="text-sm font-bold text-[#e7d61b] mb-2">want to sell your farts?</h2>
          <p className="text-gray-300 mb-3 text-xs">
            turn your gas into cash. connect your wallet to monetize your butt trumpet skills.
            the smellier, the better - our buyers pay premium for quality toots.
          </p>
          <button
            onClick={handleBuyClick}
            className={`${
              connected 
                ? 'bg-[#e7d61b] text-black hover:bg-[#c9ba17]' 
                : 'bg-gray-700 text-gray-300 cursor-not-allowed'
            } px-3 py-1 text-xs rounded transition-colors`}
            disabled={!connected}
          >
            {connected ? 'list your farts (coming soon)' : 'connect wallet to sell'}
          </button>
        </div>
      </div>
    </div>
  );
}
