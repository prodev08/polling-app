import { getToken } from 'next-auth/jwt';
import prisma from '@/prisma/client';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = await getToken({ req, secret });

    if (!token) {
      return res.status(401).json({ error: 'You must be logged in to vote' });
    }

    const { optionId, pollId } = req.body;
    const userId = token.sub;

    try {
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_pollId: {
            userId,
            pollId,
          },
        },
      });

      if (existingVote) {
        return res.status(400).json({ error: 'You have already voted for this poll' });
      }

      await prisma.vote.create({
        data: {
          userId,
          pollId,
        },
      });

      await prisma.option.update({
        where: { id: optionId },
        data: { votes: { increment: 1 } },
      });

      return res.status(200).json({ message: 'Vote counted' });
    } catch (error) {
      console.error('Error recording vote:', error);
      return res.status(500).json({ error: 'Error recording vote' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
