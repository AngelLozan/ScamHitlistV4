import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; //, GridValueGetterParams
import ShowIoc from './ShowIoc'


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', type: 'number', width: 70 },
  { field: 'url', headerName: 'URL', width: 200 },
  { field: 'created_at', headerName: 'Date Reported', width: 150 },
  { field: 'removed_date', headerName: 'Date Removed', width: 130 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'report_method_one', headerName: 'Method 1', width: 130 },
  { field: 'report_method_two', headerName: 'Method 2', width: 130 },
  { field: 'form', headerName: 'Form', width: 130 },
  { field: 'host', headerName: 'Host', width: 130 },
  { field: 'follow_up_date', headerName: 'Last follow up', width: 130 },
  { field: 'follow_up_count', headerName: 'Follow ups', type: 'number', width: 130 },
  { field: 'comments', headerName: 'Comments', width: 130 },
];

interface DataTableProps {
  rows: Row[];
  searchIocs: (event: React.FormEvent) => void;
  q: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

enum Status {
  added = 0,
  reported,
  resolved,
  official_url,
  watchlist
}

export type Row = {
  id: number;
  url: string;
  created_at: Date;
  updated_at: Date;
  removed_date: Date;
  status: Status;
  report_method_one: string;
  report_method_two: string;
  form: string;
  host: string;
  follow_up_date: Date;
  follow_up_count: number;
  comments: string;
};

const DataTable: React.FC<DataTableProps> = ({  rows, searchIocs, q, setQuery }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reset, setReset] = useState(false);

  const onRowClick = (event: number, rows: Row[]) => {
    // console.log(rows[0].id);
    console.log("EVENT: ", event);
    // const index = event - 1;
    // console.log(rows);
    // const id = rows[index].id;
    const ioc = rows.find(row => row.id === event);
    console.log("IOC: ", ioc);
    const id = ioc? ioc.id : event;
    setSelectedId(id);
    return id;
  }

  return (
    <>
      {
        typeof selectedId === 'number' ?
          <ShowIoc id={selectedId} /> :
          <>
            <form className="d-flex" onSubmit={(event) => searchIocs(event)}>
            { reset?
              <input type="text" name="q" placeholder="Reset the search 👉" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
              : <input type="text" name="q" placeholder="Search by url" className="form-control" value={q} onChange={e => setQuery(e.target.value)} />
          }

          { reset?
              <input type="submit" value="Reset" className="btn btn-primary my-2" onClick={() => setReset(false)}/>
              : <input type="submit" value="Search" className="btn btn-primary my-2" onClick={() => setReset(true)}/>
          }


            </form>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                onRowClick={(e) => onRowClick(e.row.id, rows)}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </div>
          </>
      }
    </>
  );
}

export default DataTable;
