import { NextRequest, NextResponse } from 'next/server';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB702lfEgrNGF9ZQ9rkt_qciJNXq7YpsJ8",
  authDomain: "audio-f12b2.firebaseapp.com",
  projectId: "audio-f12b2",
  storageBucket: "audio-f12b2.firebasestorage.app",
  messagingSenderId: "111140977994",
  appId: "1:111140977994:web:af6725ddac33021b3695b3",
  measurementId: "G-6CLZP36YJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching featured audio file from Firebase Storage...');
    
    // Create a reference to the file
    const fileRef = ref(storage, 'farts/TPwQxVl2JmaFwvb0vo2WVNqJ3q4.mp3');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    console.log('Download URL:', downloadURL);
    
    // Redirect to the download URL
    return NextResponse.redirect(downloadURL);
  } catch (error) {
    console.error('Error fetching featured audio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured audio' },
      { status: 500 }
    );
  }
}
