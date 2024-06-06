import { getToken } from 'next-auth/jwt';
import prisma from '@/prisma/client';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });

  console.log('Token in API route:', token);

  if (!token) {
    return res.status(401).json({ error: 'You must be logged in to create a poll' });
  }

  if (req.method === 'GET') {
    try {
      const polls = await prisma.poll.findMany({
        include: {
          options: true,
        },
      });
      return res.status(200).json(polls);
    } catch (error) {
      console.error('Error fetching polls:', error);
      return res.status(500).json({ error: 'Error fetching polls' });
    }
  } else if (req.method === 'POST') {
    const { title, options } = req.body;

    if (!title || !options || options.length < 2) {
      return res.status(400).json({ error: 'Poll must have a title and at least two options' });
    }

    try {
      const newPoll = await prisma.poll.create({
        data: {
          title,
          options: {
            create: options.map(option => ({ text: option })),
          },
        },
        include: {
          options: true,
        },
      });
      return res.status(201).json(newPoll);
    } catch (error) {
      console.error('Error creating poll:', error);
      return res.status(500).json({ error: 'Error creating poll' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
