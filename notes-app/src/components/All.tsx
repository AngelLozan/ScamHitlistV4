import DataTable, { Row } from "./DataTable";
import { useEffect, useState } from "react"

// // @dev Need to account for null or empty values.
// const rows: Row[] = [
//   { id: 1, url: 'Snow', dateReported: 'Jon', dateRemoved: 35 },
//   { id: 2, url: 'Lannister', dateReported: 'Cersei', dateRemoved: 42 },
//   { id: 3, url: 'Lannister', dateReported: 'Jaime', dateRemoved: 45 },
//   { id: 4, url: 'Stark', dateReported: 'Arya', dateRemoved: 16 },
//   { id: 5, url: 'Targaryen', dateReported: 'Daenerys', dateRemoved: 3 },
//   { id: 6, url: 'Melisandre', dateReported: "null", dateRemoved: 150 },
//   { id: 7, url: 'Clifford', dateReported: 'Ferrara', dateRemoved: 44 },
//   { id: 8, url: 'Frances', dateReported: 'Rossini', dateRemoved: 36 },
//   { id: 9, url: 'Roxie', dateReported: 'Harvey', dateRemoved: 65 },
// ];


const All = () => {
  const [q, setQuery] = useState('');
  const [rows, setIocs] = useState<Row[]>([]);
  const [reset, setReset] = useState(false);

  const handleReset = () => {
    fetchIocs();
    setReset(false);
  }


  const fetchIocs = async () => {
    try {
      const response = await fetch("http://localhost:5000/iocs");
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

  useEffect(() => {
    fetchIocs();
  }, [])

  return (
    <div className="p3 m-3">
      <h1 className="text-center m-3"><a style={{ textDecoration: 'none' }} href="/all">All Iocs</a></h1>
      <form className="d-flex" onSubmit={(event) => searchIocs(event)}>
        <input type="text" name="q" placeholder="Search by url" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
        {reset ? (
          <input type="button" value="Reset" className="btn btn-primary" onClick={handleReset} />
        ) : (
          <input type="submit" value="Search" className="btn btn-primary" />
        )}
      </form>
      <DataTable rows={rows} />
    </div>
  );
};

export default All;
