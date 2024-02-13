import React, { useState } from 'react';
import { Row } from "./DataTable";

const SearchBar = () => {
  const [rows, setIocs] = useState<Row[]>([]);
  const [reset, setReset] = useState(false);
  const [q, setQuery] = useState('');

  const handleReset = () => {
    fetchIocs();
    setReset(false);
  }


  const fetchIocs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/iocs");
      const rows = await response.json();
      setIocs(rows);
    } catch (error) {
      console.log(error);
    }
  };

  const searchIocs = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!q) {
      fetchIocs();
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/iocs/search/?q=${q}`);
      const rows: Row[] = await response.json();
      setIocs(rows);
      setQuery('');
      setReset(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className="d-flex" onSubmit={(event) => searchIocs(event)}>
        <input type="text" name="q" placeholder="Search by url" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
        {reset ? (
          <input type="button" value="Reset" className="btn btn-primary my-2" onClick={handleReset} />
        ) : (
          <input type="submit" value="Search" className="btn btn-primary my-2" />
        )}
      </form>
    </>
  )
}

export default SearchBar;
