import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "./utils/trpc";


function App() {
  const queryClient = useQueryClient();
  const animeQuery = useQuery(['getAllAnimes'], () => api.anime.getAllAnimes.query())
  const createAnimeMutation = useMutation(['createAnime'], api.anime.createAnime.mutate)

  const [genre, setGenre] = useState("")
  const [name, setName] = useState("")
  const [score, setScore] = useState(0)
  const [season, setSeason] = useState("")
  const [synopsis, setSynopsis] = useState("")
  const [year, setYear] = useState("")

  if (animeQuery.isLoading) return <div>Loading...</div>;
  if (animeQuery.isError) return <div>ERROR!</div>;

  return (
    <div className="text-2xl">
      oi
      <p>{JSON.stringify(animeQuery.data?.allAnimes)}</p>
      <form onSubmit={(e) => {
        e.preventDefault()
        createAnimeMutation.mutate({ genre, name, score, season, synopsis, year });
        queryClient.invalidateQueries('getAllAnimes');
      }}>
        <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.valueAsNumber)} />
        <input type="text" placeholder="Season" value={season} onChange={(e) => setSeason(e.target.value)} />
        <input type="text" placeholder="Synopsis" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
        <input type="text" placeholder="Year" value={year}  onChange={(e) => setYear(e.target.value)} />
        <button>Add anime</button>
      </form>
    </div>
  )
}

export default App
