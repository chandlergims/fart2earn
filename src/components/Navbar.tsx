'use client';

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

export default function Navbar() {
  const { connected, walletAddress, connecting, connectWallet, disconnectWallet } = useWallet();

  // Function to truncate wallet address for display
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`.toLowerCase();
  };

  return (
    <nav className="bg-[#363636] w-full z-20">
      <div className="flex items-center justify-between p-4 pt-6 relative">
        <div className="flex space-x-4">
          <Link href="/" className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer">
            home
          </Link>
          <Link href="/leaderboard" className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer">
            leaderboard
          </Link>
          <Link href="/shop" className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer">
            shop
          </Link>
          <Link href="/about" className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer">
            about
          </Link>
          <a 
            href="https://x.com/fart2earnapp" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer"
          >
            twitter
          </a>
          <a 
            href="https://github.com/chandlergims/fart2earn" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer"
          >
            github
          </a>
        </div>
        
        {/* Absolutely positioned center element */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="flex items-center">
            <pre className="text-xs text-[#e7d61b] font-mono">
{`    ____           __ ___                       
   / __/___ ______/ /|__ \\ ___  ____ __________ 
  / /_/ __ \`/ ___/ __/_/ // _ \\/ __ \`/ ___/ __ \\
 / __/ /_/ / /  / /_/ __//  __/ /_/ / /  / / / /
/_/  \\__,_/_/   \\__/____/\\___/\\__,_/_/  /_/ /_/`}
            </pre>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/hall-of-farts" className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer">
            hall of farts
          </Link>
          
          {connected ? (
            <div className="flex items-center">
              <span className="text-sm text-gray-300 mr-3 hidden md:inline">
                {truncateAddress(walletAddress || '')}
              </span>
              <button 
                type="button" 
                onClick={disconnectWallet}
                className="text-[#e7d61b] hover:text-[#c9ba17] transition-colors cursor-pointer"
                title="Disconnect Wallet"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={connectWallet}
              disabled={connecting}
              className="bg-transparent hover:bg-[#2a2a2a] text-[#e7d61b] font-medium text-xs px-3 py-1 text-center border border-[#e7d61b] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting ? 'connecting...' : 'connect wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
