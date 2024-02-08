import React, { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ShowIoc from './ShowIoc'


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'url', headerName: 'URL', width: 130 },
  { field: 'dateReported', headerName: 'Date Reported', width: 150 },
  // { field: 'dateRemoved', headerName: 'Date Removed', width: 130 },
  {
    field: 'dateRemoved',
    headerName: 'Date Removed',
    type: 'number',
    width: 150,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
];

interface DataTableProps {
  rows: Row[];
  // onRowClick: (rows: Row[]) => void;
}

export type Row = {
  id: number;
  url: string;
  dateReported: string;
  dateRemoved: number;
};

const DataTable: React.FC<DataTableProps> = ({ rows }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onRowClick = (event: number, rows: Row[]) => {
    // console.log(rows[0].id);
    console.log("EVENT: ", event);
    const index = event - 1;
    const id = rows[index].id;
    setSelectedId(id);
    return id;
  }

  return (
    <>
    {
      typeof selectedId === 'number' ?
        <ShowIoc id={selectedId}/> :
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
    }
  </>
  );
}

export default DataTable;
