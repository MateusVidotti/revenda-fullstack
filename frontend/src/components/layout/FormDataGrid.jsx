import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper} from '@mui/material';
import { ptBR } from '@mui/x-data-grid/locales';


function FormDataGrid ( { rows, columns } ){
    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
        </Paper>

    )
}

export default FormDataGrid