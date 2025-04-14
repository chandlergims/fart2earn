'use client';

import Script from 'next/script';

export default function PhantomScript() {
  return (
    <>
      <Script
        id="phantom-wallet-check"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if ("solana" in window) {
                console.log("Phantom wallet is installed!");
              } else {
                console.log("Phantom wallet is not installed. Users will be prompted to install it when trying to connect.");
              }
            } catch (error) {
              console.error("Error checking for Phantom wallet:", error);
            }
          `,
        }}
      />
    </>
  );
}
