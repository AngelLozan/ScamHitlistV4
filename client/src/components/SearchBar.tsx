import React, { useState } from 'react';
import Flash from "./Flash";

const SearchBar = () => {
  const [reset, setReset] = useState(false);
  const [q, setQuery] = useState('');

  const searchIocs = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!q && reset) {
      Flash("Please enter a search query ser", "info")
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/iocs/search/?q=${q}`);
      const found = await response.json();
      if (found.length > 0) {
        Flash("Looks like this already exists in the database. Search on the All page.", "warning")
      } else {
        Flash("Ioc not found/created. Create one below 👇", "success");
      }
      setQuery('');
      setReset(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className="d-flex" onSubmit={(event) => searchIocs(event)}>
        {reset ?
          <input type="text" name="q" placeholder="Reset the search 👉" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
          : <input type="text" name="q" placeholder="Search by url" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
        }

        {reset ?
          <input type="submit" value="Reset" className="btn btn-primary my-2" onClick={() => setReset(false)} />
          : <input type="submit" value="Search" className="btn btn-primary my-2" onClick={() => setReset(true)} />
        }

      </form>

      {/* <form className="d-flex" onSubmit={(event) => searchIocs(event)}>
        <input type="text" name="q" placeholder="Search by url" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
        {reset ? (
          <input type="button" value="Reset" className="btn btn-primary my-2" onClick={handleReset} />
        ) : (
          <input type="submit" value="Search" className="btn btn-primary my-2" />
        )}
      </form> */}

    </>
  )
}

export default SearchBar;
