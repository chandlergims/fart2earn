import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Fart, { IFart } from '@/models/Fart';

// Define the voter interface
interface Voter {
  walletAddress: string;
  vote: 'like' | 'dislike';
}

export async function POST(req: NextRequest) {
  try {
    const { fartId, walletAddress, vote } = await req.json();
    
    if (!fartId || !walletAddress || !vote) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (vote !== 'like' && vote !== 'dislike') {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "like" or "dislike"' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the fart
    const fart = await Fart.findById(fartId);
    
    if (!fart) {
      return NextResponse.json(
        { error: 'Fart not found' },
        { status: 404 }
      );
    }
    
    // Check if the fart already has 20 likes and the user is trying to like it
    if (vote === 'like' && fart.likes >= 20) {
      // Check if the user has already liked this fart
      const hasAlreadyLiked = fart.voters.findIndex(
        (voter: Voter) => voter.walletAddress === walletAddress && voter.vote === 'like'
      ) !== -1;
      
      // If they haven't already liked it, prevent them from adding a new like
      if (!hasAlreadyLiked) {
        return NextResponse.json(
          { error: 'This fart has reached the maximum number of likes (20)' },
          { status: 400 }
        );
      }
    }
    
    // Check if user has already voted
    const existingVoteIndex = fart.voters.findIndex(
      (voter: Voter) => voter.walletAddress === walletAddress
    );
    
    if (existingVoteIndex !== -1) {
      const existingVote = fart.voters[existingVoteIndex].vote;
      
      // If the vote is the same, remove it (toggle off)
      if (existingVote === vote) {
        // Decrement the vote count
        fart[`${vote}s`] -= 1;
        
        // Remove the voter
        fart.voters.splice(existingVoteIndex, 1);
      } else {
        // If the vote is different, update it
        // Decrement the old vote count
        fart[`${existingVote}s`] -= 1;
        
        // Increment the new vote count
        fart[`${vote}s`] += 1;
        
        // Update the voter's vote
        fart.voters[existingVoteIndex].vote = vote;
      }
    } else {
      // If the user hasn't voted before, add the vote
      fart[`${vote}s`] += 1;
      fart.voters.push({ walletAddress, vote });
    }
    
    await fart.save();
    
    return NextResponse.json({
      success: true,
      fart: {
        id: fart._id,
        likes: fart.likes,
        dislikes: fart.dislikes,
      userVote: fart.voters.find((voter: Voter) => voter.walletAddress === walletAddress)?.vote || null
      }
    });
  } catch (error) {
    console.error('Error voting on fart:', error);
    return NextResponse.json(
      { error: 'Failed to vote on fart' },
      { status: 500 }
    );
  }
}
