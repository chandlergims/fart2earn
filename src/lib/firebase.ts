// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
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

/**
 * Upload a file to Firebase Storage
 * @param file - The file buffer to upload
 * @param fileName - The name to give the file in storage
 * @param contentType - The content type of the file
 * @returns Promise with the download URL
 */
export async function uploadFileToFirebase(
  file: Buffer | Uint8Array | ArrayBuffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `farts/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: contentType
    });
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`File uploaded to Firebase: ${fileName}`);
    console.log(`Download URL: ${downloadURL}`);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    throw new Error(`Failed to upload file to Firebase: ${error.message}`);
  }
}

export { storage };
