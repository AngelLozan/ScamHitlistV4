import DataTable from "./DataTable";

// @dev Need to account for null or empty values.
const rows = [
  { id: 1, url: 'Snow', dateReported: 'Jon', dateRemoved: 35 },
  { id: 2, url: 'Lannister', dateReported: 'Cersei', dateRemoved: 42 },
  { id: 3, url: 'Lannister', dateReported: 'Jaime', dateRemoved: 45 },
  { id: 4, url: 'Stark', dateReported: 'Arya', dateRemoved: 16 },
  { id: 5, url: 'Targaryen', dateReported: 'Daenerys', dateRemoved: 3 },
  { id: 6, url: 'Melisandre', dateReported: "null", dateRemoved: 150 },
  { id: 7, url: 'Clifford', dateReported: 'Ferrara', dateRemoved: 44 },
  { id: 8, url: 'Frances', dateReported: 'Rossini', dateRemoved: 36 },
  { id: 9, url: 'Roxie', dateReported: 'Harvey', dateRemoved: 65 },
];


const All = () => {
  return (
    <div className="p3 m-3">
      <h1 className="text-center m-3"><a style={{textDecoration: 'none'}} href="/all">All Iocs</a></h1>
      <DataTable rows = {rows} />
    </div>
  );
};

export default All;
