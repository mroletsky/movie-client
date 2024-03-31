import './App.css';
import axios from './api/axiosConfig';
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import SessionDetails from './SessionDetails';

function App() {

  const [films, setFilms] = useState();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const ageLimits = [0, 6, 12, 14, 16, 18];
  const [selectedAgeLimit, setSelectedAgeLimit] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [recommendedFilm, setRecommendedFilm] = useState(null);


  useEffect(() => {
    // Fetch all films when the component mounts
    axios.get('/films')
        .then(response => {
            setFilms(response.data);
        })
        .catch(error => {
            console.error('Error fetching films', error);
        });

    // Fetch all genres when the component mounts
    axios.get('/films/genres')
        .then(response => {
            setGenres(response.data);
        })
        .catch(error => {
            console.error('Error fetching genres', error);
        });
  }, []);

  useEffect(() => {
    // Fetch films by genre and/or age limit
    let url = '/films';

    if (selectedGenre) {
        url += `/genre/${selectedGenre}`;
    } 
    if (selectedAgeLimit) {
        url += `/age/${selectedAgeLimit}`;
    }
    axios.get(url)
        .then(response => {
            setFilms(response.data);
        })
        .catch(error => {
            console.error('Error fetching films', error);
        });
  }, [selectedGenre, selectedAgeLimit]);

  useEffect(() => {
    // Fetch sessions by date and/or language
    let url = '/sessions';
    if (selectedDate) {
        url += `/date/${selectedDate}`;
    }
    if (selectedLanguage) {
        url += `/language/${selectedLanguage}`;
    }

    axios.get(url)
        .then(response => {
            setSessions(response.data);
        })
        .catch(error => {
            console.error('Error fetching sessions', error);
        });
  }, [selectedDate, selectedLanguage]);

  const handleRecommendFilm = () => {
    axios.get('/films/recommend')
        .then(response => {
            setRecommendedFilm(response.data);
        })
        .catch(error => {
            console.error('Error fetching recommended film', error);
        });
  };

  return (
      <Routes>
        <Route path="/session/:id" element={<SessionDetails />} />
        <Route path="/*" element={
          <div className="App">
              <h1>Currently Streamed Films</h1>
              <button onClick={handleRecommendFilm}>Recommend Film</button>
                {recommendedFilm && (
                    <div>
                        <h2>{recommendedFilm.title}</h2>
                        <p>{recommendedFilm.genres.join(' ')}</p>
                    </div>
                )}
            <div className="container" style={{display: 'flex'}}>
              <div className="films" style={{flex: 1}}>
              <h2>Films</h2>
              <select value={selectedAgeLimit} onChange={e => setSelectedAgeLimit(e.target.value)}>
                    <option value="">All Age Limits</option>
                    {ageLimits.map(ageLimit => (
                        <option key={ageLimit} value={ageLimit}>
                            {ageLimit}
                        </option>
                    ))}
                </select>
                <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                {films && films.map(film => (
                    <div key={film.id}>
                        <h2>{film.title}</h2>
                        <p>{film.genres.join(' ')}</p>
                    </div>
                ))}
              </div>
              <div className="sessions" style={{flex: 1}}>
              <h2>Sessions</h2>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">All Languages</option>
                    <option value="Estonian">Estonian</option>
                    <option value="English">English</option>
                    <option value="Russian">Russian</option>
                </select>
                <div className="sessions">
                  {sessions.map(session => (
                  <div key={session.id} onClick={() => window.location.href=`/session/${session.id}`}>
                      <h2>{session.film.title}</h2>
                      <p>{new Date(session.time).toLocaleString()}</p>
                      <p>{session.language}</p>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>
);
}

export default App;


