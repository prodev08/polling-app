import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [results, setResults] = useState({});
  const [voteSuccess, setVoteSuccess] = useState(false);

  const fetchPolls = async () => {
    const res = await fetch('/api/polls');
    if (res.ok) {
      const data = await res.json();
      setPolls(data);
    } else {
      console.error('Failed to fetch polls:', res.status);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPolls();
      fetch('/api/votes')
        .then((response) => response.json())
        .then((data) => setVotedPolls(new Set(data.map((vote) => vote.pollId))));
    }
  }, [session]);

  const handleVote = async () => {
    if (selectedOption) {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOption, pollId: selectedPollId }),
      });
      const data = await res.json();
      if (res.ok) {
        setVotedPolls((prev) => new Set(prev).add(selectedPollId));
        setVoteSuccess(true);
        setTimeout(() => setVoteSuccess(false), 2000); // Hide success message after 2 seconds
        fetchPolls(); // Refresh polls after voting
      } else {
        alert(data.error);
      }
    }
  };

  const handleViewResults = async (pollId) => {
    const res = await fetch(`/api/results?pollId=${pollId}`);
    const data = await res.json();
    setResults((prev) => ({ ...prev, [pollId]: data }));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">You must be signed in to vote</h1>
        <Link href="/signin">
          <a className="bg-blue-500 text-white px-4 py-2 rounded">Sign In</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Polls</h1>
      <Link href="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Poll
      </Link>
      <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded ml-4">
        Sign Out
      </button>
      <div className="mt-4">
        {voteSuccess && (
          <div className="bg-green-500 text-white p-2 rounded mb-4">
            Vote counted successfully!
          </div>
        )}
        {polls.map((poll) => (
          <div key={poll.id} className="border p-4 mb-4">
            <h2 className="text-xl font-bold">{poll.title}</h2>
            {poll.options.map((option) => (
              <div key={option.id} className="mt-2">
                <input
                  type="radio"
                  id={`option-${option.id}`}
                  name={`poll-${poll.id}`}
                  onChange={() => {
                    setSelectedOption(option.id);
                    setSelectedPollId(poll.id);
                  }}
                />
                <label htmlFor={`option-${option.id}`} className="ml-2">
                  {option.text}
                </label>
              </div>
            ))}
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleVote}
              disabled={!selectedOption || selectedPollId !== poll.id || votedPolls.has(poll.id)}
            >
              Vote
            </button>
            <button
              className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleViewResults(poll.id)}
            >
              View Results
            </button>
            {results[poll.id] && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Results:</h3>
                {results[poll.id].map((result) => (
                  <div key={result.optionId} className="mt-2">
                    {result.optionText}: {result.votes} votes
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
