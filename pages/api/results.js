import prisma from "@/prisma/client"

export default async (req, res) => {
  if (req.method === 'GET') {
    const { pollId } = req.query
    const options = await prisma.option.findMany({
      where: { pollId: parseInt(pollId) },
      select: {
        id: true,
        text: true,
        votes: true
      }
    })

    const results = options.map(option => ({
      optionId: option.id,
      optionText: option.text,
      votes: option.votes
    }))

    res.status(200).json(results)
  }
}
