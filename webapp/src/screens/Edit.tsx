import * as React from 'react';
import {useState, useEffect, useMemo, useCallback, ChangeEvent, useContext} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import xlsx from "json-as-xlsx"
import {spreadSheetData, settings, transformToJson} from "../utils/ExcelUtils";
import * as excel from "xlsx";
import {getAllQnA, updateQuestions} from "../api/QuestionAnswerApi";
import {darkTheme, lightTheme} from "../utils/Themes";
import {ScreenContext} from "../App";

export interface Exchange {
    exchangeId: string,
    question: string,
    answer: string
}

const Edit = () => {
  const { screenState } = useContext(ScreenContext);
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
      const { exchanges } = await getAllQnA();
      setRowData(exchanges);
    })();
  }, []);

  useEffect(() => {
    if (file !== null && file !== undefined) {
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setError(true);
        setErrorMsg("Invalid file type given to upload.  Excel files with .xlsx are only accepted as of now.");
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target === null) {
            throw Error("file reading error");
          } else {
            const data = e.target.result;
            const readData = excel.read(data, { type: 'binary'});
            const wsname = readData.SheetNames[0];
            const ws = readData.Sheets[wsname];

            const dataParse = excel.utils.sheet_to_json(ws, { header: 1 });
            // @ts-ignore
            const jsonData = transformToJson(dataParse);
            (async () => {
              const res = await updateQuestions(jsonData);
              if (res.status !== 200) {
                setError(true);
                setErrorMsg("Unable to save questions/answers at the moment, please try again")
              }
              setRowData(jsonData.exchanges);
            })();
          }
        }
        reader.onerror = (e) => {
          console.error("Error reading excel file");
          setErrorMsg("Error reading excel file");
          setError(true);
        }
        reader.readAsBinaryString(file);
      } catch (e) {
        console.error("Error reading excel file");
        setErrorMsg("Error reading excel file");
        setError(true);
      }
    }
  }, [file]);

  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

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
      <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
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
              <Typography variant="h6" align="center" color="red" paragraph>
                {errorMsg}
              </Typography>
            </Grid>
          </Grid>
      </main>
    </ThemeProvider>
  );
}

export default Edit;