import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Results() {
  const router = useRouter()
  const { pollId } = router.query
  const [poll, setPoll] = useState(null)

  useEffect(() => {
    if (pollId) {
      fetch(`/api/results?pollId=${pollId}`)
        .then(response => response.json())
        .then(data => setPoll(data))
    }
  }, [pollId])

  if (!poll) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      <ul>
        {poll.options.map(option => (
          <li key={option.id} className="mb-2">
            <span>{option.text}: </span>
            <span className="font-bold">{option.votes} votes</span>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => router.push('/')}
      >
        Back to Polls
      </button>
    </div>
  )
}
