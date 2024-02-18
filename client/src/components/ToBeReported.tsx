import DataTable, { Row } from "./DataTable";
import { useEffect, useState } from "react"
// import Flash from "./Flash";

const ToBeReported = () => {
  const [rows, setIocs] = useState<Row[]>([]);
  const [q, setQuery] = useState('');


  const fetchIocs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/iocs/2b_reported");
      const rows = await response.json();
      setIocs(rows);
    } catch (error) {
      console.log(error);
    }
  };

  // const searchIocs = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (!q) {
  //     fetchIocs();
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:5000/api/iocs/search/?q=${q}`);
  //     const rows: Row[] = await response.json();
  //     setIocs(rows);
  //     setQuery('');
  //     // setReset(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchIocs();
  }, [])

  return (
    <>
    {rows.length === 0 ?
      <h1 className="m-3 text-center">Nothing to report ✅</h1>
      :
      <div className="p3 m-3">
        <h1 className="text-center m-3"><a style={{ textDecoration: 'none' }} href="/2b_reported">2B Reported</a></h1>
        <DataTable rows={rows} q={q} setQuery={setQuery} />
      </div>
    }

  </>
  );
};

export default ToBeReported;
