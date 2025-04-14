'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  walletAddress: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/wallet');
        const data = await response.json();
        
        if (data.authenticated) {
          setConnected(true);
          setWalletAddress(data.user.walletAddress);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  const connectWallet = async () => {
    try {
      setConnecting(true);

      // Check if Phantom wallet is installed
      const { solana } = window as any;

      if (!solana?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        throw new Error('Phantom wallet is not installed');
      }

      // Connect to wallet
      const response = await solana.connect();
      const walletAddress = response.publicKey.toString();

      // Register/login user with the backend
      const authResponse = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.error || 'Failed to authenticate wallet');
      }

      setConnected(true);
      setWalletAddress(walletAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      // Don't show alert if user rejected the connection (common error when user cancels)
      if (!(error instanceof Error && error.message.includes('User rejected'))) {
        console.error('Wallet connection error:', error);
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any;

      if (solana?.isPhantom) {
        await solana.disconnect();
      }

      // Call the logout API endpoint to clear the cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      setConnected(false);
      setWalletAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        walletAddress,
        connecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
