import * as React from 'react';
import { useState, useEffect, useMemo, useCallback} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const defaultTheme = createTheme();

const Edit = () => {
	const [rowData, setRowData] = useState();

	const [columnDefs, setColumnDefs] = useState([
    {field: 'make', filter: true},
    {field: 'model', filter: true},
    {field: 'price'}
  ]);

  const defaultColDef = useMemo(()=> ({
    sortable: true
  }), [rowData]);

	useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

	return (
		<ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 6,
            pb: 6,
          }}
        >
          <Grid container direction="column" alignItems="center" >
            <Grid item>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Welcome Professor
              </Typography>
            </Grid>
            <Grid item>
              <div className="ag-theme-alpine" style={{width: 500, height: 500}}>
                <AgGridReact
                  rowData={rowData} // Row Data for Rows
                  columnDefs={columnDefs} // Column Defs for Columns
                  defaultColDef={defaultColDef} // Default Column Properties
                  animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                  rowSelection='multiple' // Options - allows click selection of rows
                  />
              </div>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Grid container direction="column" alignItems="center" >
            <Grid item>
              <Typography variant="h6" align="center" color="text.secondary" paragraph>
                TODO: So here we explain the instructions to the professor for how to view, upload etc.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default Edit;