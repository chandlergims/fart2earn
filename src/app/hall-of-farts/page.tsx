'use client';

import { useState } from 'react';

interface Winner {
  id: number;
  name: string;
  fartName: string;
  walletAddress: string;
  prize: string;
  date: string;
}

// Sample data for previous winners
const SAMPLE_WINNERS: Winner[] = [
  {
    id: 1,
    name: 'fartmaster3000',
    fartName: 'the thunderclap',
    walletAddress: 'EjcZMQ...PF97uXr',
    prize: '0.5 SOL',
    date: 'april 1, 2025'
  },
  {
    id: 2,
    name: 'gasgiant',
    fartName: 'silent but deadly',
    walletAddress: 'Gh73mN...Kj8dPq',
    prize: '0.3 SOL',
    date: 'march 15, 2025'
  },
  {
    id: 3,
    name: 'rumbletumble',
    fartName: 'bass cannon',
    walletAddress: '7XtPz5...9vBnLs',
    prize: '0.2 SOL',
    date: 'february 28, 2025'
  }
];

export default function HallOfFarts() {
  // Use sample data directly without loading simulation
  const winners = SAMPLE_WINNERS;
  
  return (
    <div className="min-h-screen bg-[#363636] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#e7d61b] mb-6 text-center">hall of farts</h1>
        <p className="text-gray-300 text-center mb-8">
          celebrating the legendary farts that have earned their place in history.
          these champions of flatulence have been recognized for their exceptional contributions to the fart2earn ecosystem.
        </p>
        
        <div className="space-y-6">
          {winners.map((winner) => (
            <div key={winner.id} className="bg-[#2a2a2a] rounded-lg p-6 border border-[#444] shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[#e7d61b]">{winner.fartName}</h2>
                  <p className="text-gray-400">by {winner.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-[#e7d61b] font-bold">{winner.prize}</div>
                  <div className="text-gray-400 text-sm">{winner.date}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#444] text-gray-300 text-sm">
                <p>wallet: {winner.walletAddress}</p>
                <p className="mt-2 italic">
                  "this legendary fart captivated audiences with its unique resonance and cultural impact."
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm italic">
            note: this is placeholder data. real winners will be displayed after the first week of competition is complete.
          </p>
        </div>
      </div>
    </div>
  );
}
