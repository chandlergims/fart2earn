'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-[#363636] text-white flex flex-col">
      <div className="mt-20 mb-8 p-8">
        <h1 className="text-xl font-bold text-[#e7d61b]">about fart2earn</h1>
      </div>
      
      <div className="w-full p-8 pt-0">
        <div className="mb-8 border-b border-[#444] pb-8">
          <h2 className="text-sm font-bold text-[#e7d61b] mb-4">what is fart2earn?</h2>
          <p className="text-gray-300 text-xs mb-4">
            fart2earn is a decentralized fart-to-earn protocol built on solana.
          </p>
          <p className="text-gray-300 text-xs mb-4">
            upload your best farts, earn votes, win sol. powered by cheeks, judged by the crowd.
          </p>
          <p className="text-gray-300 text-xs mb-4">
            our revolutionary platform allows anyone with a microphone and digestive system to monetize their natural talents.
          </p>
        </div>

        <div className="mb-8 border-b border-[#444] pb-8">
          <h2 className="text-sm font-bold text-[#e7d61b] mb-4">how it works</h2>
          <div className="space-y-6">
            <div className="flex">
              <div className="w-8 h-8 flex-shrink-0 bg-[#e7d61b] text-black rounded-full flex items-center justify-center mr-4 font-bold">1</div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">connect your wallet</h3>
                <p className="text-gray-300 text-xs">link your phantom wallet to start your fart2earn journey.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 flex-shrink-0 bg-[#e7d61b] text-black rounded-full flex items-center justify-center mr-4 font-bold">2</div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">record your farts</h3>
                <p className="text-gray-300 text-xs">capture your unique acoustic signatures using any recording device.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 flex-shrink-0 bg-[#e7d61b] text-black rounded-full flex items-center justify-center mr-4 font-bold">3</div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">upload to the blockchain</h3>
                <p className="text-gray-300 text-xs">submit your audio masterpieces to our decentralized platform.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 flex-shrink-0 bg-[#e7d61b] text-black rounded-full flex items-center justify-center mr-4 font-bold">4</div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">earn votes</h3>
                <p className="text-gray-300 text-xs">the community votes on their favorite farts, with the most popular rising to the top.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 flex-shrink-0 bg-[#e7d61b] text-black rounded-full flex items-center justify-center mr-4 font-bold">5</div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">win rewards</h3>
                <p className="text-gray-300 text-xs">top performers each week earn sol rewards based on their leaderboard position.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 border-b border-[#444] pb-8">
          <h2 className="text-sm font-bold text-[#e7d61b] mb-4">tokenomics</h2>
          <p className="text-gray-300 text-xs mb-4">
            fart2earn operates on a weekly competition cycle with 500 sol distributed to the top performers each week.
          </p>
          <div className="flex flex-col space-y-4 mb-4">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">weekly prize pool</h3>
              <p className="text-[#e7d61b] text-lg font-bold">20 sol</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-1">top reward</h3>
              <p className="text-[#e7d61b] text-lg font-bold">5 sol</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs">
            rewards are only distributed to holders of our $FART token at the end of each weekly competition.
          </p>
        </div>
        
        <div className="mb-8 border-b border-[#444] pb-8">
          <h2 className="text-sm font-bold text-[#e7d61b] mb-4">shop coming soon</h2>
          <p className="text-gray-300 text-xs mb-4">
            our marketplace will soon allow you to buy and sell premium fart sounds as nfts.
          </p>
          <p className="text-gray-300 text-xs mb-4">
            collect rare farts from top performers, or sell your own acoustic masterpieces for sol.
          </p>
          <p className="text-gray-300 text-xs">
            visit the shop page for a preview of what's brewing in our backend.
          </p>
        </div>
        
        <div className="mb-8 border-b border-[#444] pb-8">
          <h2 className="text-sm font-bold text-[#e7d61b] mb-4">community guidelines</h2>
          <ul className="text-gray-300 text-xs space-y-2 list-disc pl-5">
            <li>all farts must be authentic and original.</li>
            <li>no artificial or synthesized fart sounds allowed.</li>
            <li>respect the community and avoid offensive content.</li>
            <li>one wallet = one vote per fart.</li>
            <li>weekly competitions reset every sunday at midnight UTC.</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-sm font-bold text-[#e7d61b] mb-4">support development</h2>
          <p className="text-gray-300 text-xs mb-4">
            help support the development of the fart2earn protocol:
          </p>
          <div className="bg-[#2a2a2a] p-3 rounded-md mb-4">
            <p className="text-[#e7d61b] text-xs font-mono break-all select-all">
              EjcZMQiUFonJErgeXzHv9rQf2BUPUR5JCXa42PF97uXr
            </p>
          </div>
          <p className="text-gray-300 text-xs">
            your contributions help us improve the platform and add new features for the community.
          </p>
        </div>
      </div>
    </div>
  );
}
