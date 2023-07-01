import * as React from 'react';
import {useState, useEffect, useMemo, useCallback, ChangeEvent} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import xlsx from "json-as-xlsx"
import { spreadSheetData, settings } from "./Edit.api";
import {excelToJsonOptions} from "./Edit.api";

const defaultTheme = createTheme();

export interface Exchange {
    exchangeId: string,
    question: string,
    answer: string
}

const Edit = () => {
	const [rowData, setRowData] = useState<Array<Exchange>>([]);
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

	const [columnDefs, setColumnDefs] = useState([
    {field: 'exchangeId', filter: true, type: 'numberColumn'},
    {field: 'question', filter: true},
    {field: 'answer', filter: false }
  ]);

  const defaultColDef = useMemo(()=> ({
    flex: 1,
    sortable: true,
    wrapText: true,
    autoWidth: true,
    autoHeight: true,
    resizable: true
  }), [rowData]);

  const downloadExcel = useCallback(() => {
    const data = spreadSheetData;
    // @ts-ignore
    data[0].content = rowData;
    xlsx(data, settings);
  }, [rowData]);

	useEffect(() => {
    (async () => {
      const res = await axios({
        timeout: 300000,
        url: "https://answering-svc.onrender.com/all",
        method: "GET"
      });
      setRowData(res.data.exchanges);
    })();
  }, []);

  useEffect(() => {
    if (file !== null && file !== undefined) {
      console.log('file set state action');
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setError(true);
        setErrorMsg("Invalid file type given to upload.  Excel files with .xlsx are only accepted as of now.");
      }
      // const result = excelToJson(excelToJsonOptions(file.name), (error: any, result: any) => {
      //   if (error) {
      //     console.error("Error converting excel to json" + error);
      //     setError(true);
      //     setErrorMsg("Error converting the excel given. Corrupted file?");
      //   } else {
      //     console.log(`result: ${result}`);
      //   }
      // });
      // console.log(`result: ${JSON.stringify(result)}`)
    }
  }, [file]);

  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setErrorMsg("");
    if (event !== null && event.target.files !== null && event.target.files[0] !== undefined) {
      setFile(event.target.files[0]);
    } else {
      setError(true);
      setErrorMsg("Invalid file chosen.  Please try again!")
    }
  }, [file, error, errorMsg]);


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
              <div className="ag-theme-alpine" style={{width: 1000, height: 500}}>
                <AgGridReact
                  rowData={rowData} // Row Data for Rows
                  // @ts-ignore
                  columnDefs={columnDefs} // Column Defs for Columns
                  defaultColDef={defaultColDef} // Default Column Properties
                  animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                  rowSelection='multiple' // Options - allows click selection of rows
                  />
              </div>
            </Grid>
          </Grid>
        </Box>


          <Grid container direction="column" alignItems="center" >
            <Grid item>
              <Stack spacing={4} direction="row">
                <Button variant="contained" onClick={() => { downloadExcel(); }}>Download</Button>
                <Button variant="outlined" component="label"><input type="file" hidden onChange={onFileChange}/>Upload</Button>
              </Stack>
            </Grid>
            <Grid item>
              <Typography variant="h6" align="center" color="text.secondary" paragraph>
                {errorMsg}
              </Typography>
            </Grid>
          </Grid>
      </main>
    </ThemeProvider>
  );
}

export default Edit;