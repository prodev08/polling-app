import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function CreatePoll() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const router = useRouter();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    } else {
      alert("A poll must have at least two options.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, options }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">You must be signed in to create a poll</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Poll Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Options</label>
          {options.map((option, index) => (
            <div key={index} className="mb-2 flex">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddOption}
        >
          Add Option
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}
