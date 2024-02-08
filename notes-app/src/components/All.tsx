import DataTable from "./DataTable";


const rows = [
  { id: 1, url: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, url: 'Lannister', firstName: 'Cersei', age: 42 },
];

const All = () => {
  return (
    <div className="p3 m-3">
      <h1 className="text-center m-3">All Iocs</h1>
      <DataTable rows = {rows}/>
    </div>
  );
};

export default All;
