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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import xlsx from "json-as-xlsx"
import {spreadSheetData, settings, transformToJson} from "../utils/ExcelUtils";
import * as excel from "xlsx";
import {updateQuestions} from "../api/QuestionAnswerApi";
import {darkTheme, lightTheme} from "../utils/Themes";
import {ScreenContext} from "../App";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DocumentTable from "./tabs/DocumentsTable";

export interface Exchange {
    id: string,
    question: string,
    answer: string
}

const Edit = () => {
  const { screenState } = useContext(ScreenContext);
  const [rowData, setRowData] = useState<Array<Exchange>>([]);
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [columnDefs, setColumnDefs] = useState([
    {field: 'id', filter: true, type: 'numberColumn', maxWidth: 140, cellStyle: {wordBreak: "normal"}},
    {field: 'question', filter: true, cellStyle: {wordBreak: "normal"}},
    {field: 'answer', filter: false, cellStyle: {wordBreak: "normal"}}
  ]);

  const defaultColDef = useMemo(()=> ({
    flex: 1,
    sortable: true,
    wrapText: true,
    autoWidth: true,
    autoHeight: true,
    resizable: true,
    wrapHeaderText: true,
  }), [rowData]);

  const downloadExcel = useCallback(() => {
    const data = spreadSheetData;
    // @ts-ignore
    data[0].content = rowData;
    xlsx(data, settings);
  }, [rowData]);

	useEffect(() => {
    (async () => {
      const exchanges = screenState.exchanges;
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
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Manage Questions" />
          <Tab label="Manage Course Documents" />
        </Tabs>
      </Box>
      <div key={"questions-content"} style={{ display: tabValue === 0 ? '' : 'none' }}>
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 0,
              pb: 2,
            }}
          >
            <Grid container direction="column" alignItems="center" >
              <Grid item>
                <Container maxWidth="md" sx={{
                  marginLeft: 0
                }}>
                  <Box
                      sx={{
                        pt: 0,
                        pb: 2
                      }}
                  >
                    <Divider></Divider>
                    <Typography
                        variant="body1"
                        align="left"
                        color="text.secondary"
                        maxWidth = "md"
                    >
                      Thank you for choosing to use QBot to handle your frequently asked questions!
                      Here you will find the latest questions and answers uploaded into the database, which you can scroll through.
                      Scroll down further on the page itself to find instructions on how to manage the database.
                    </Typography>
                  </Box>
                </Container>
              </Grid>

              <Grid item>
                <div className="ag-theme-alpine" style={{width: 1000, height: 500, wordBreak:"keep-all"}}>
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



          <Box
              sx={{
                bgcolor: 'background.paper',
                pt: 0,
                pb: 2,
              }}
          >
            <Grid container direction="column" alignItems="center" >
              <Grid item>
                <Container maxWidth="md" sx={{
                  marginLeft: 0
                }}>
                  <Typography
                      variant="h5"
                      align="center"
                      color="text.secondary"
                  >
                    Database Management Instructions:
                  </Typography>
                  <Divider></Divider>

                  <Box
                      sx={{
                        pt: 0,
                        pb: 0
                      }}
                  >
                    <Typography
                        variant="body1"
                        align="left"
                        color="text.secondary"
                        maxWidth = "md"
                    >
                      In order to change the database of questions and answers please follow the steps below:
                      <div></div>

                      1.) Download the current database, by clicking on the download button below the current displayed database. This will ensure you are working off of the latest questions and answers.
                      <div></div>

                      2.) On your desktop, open the .xslx file within excel and edit the database to how you see fit.
                      <div></div>

                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><u>Important Reminders:</u></strong>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        a.) Ensure the .xslx file has three columns labeled: “Id”, “Question”, and “Answer”.
                      </div>

                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        b.) Ensure that the top 6 Questions and Answers are your most frequently asked, as these are the ones that will be displayed directly to students.
                      </div>

                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        c.) Ensure that the file is saved as a .xslx file. CSV or other file types will not work!
                      </div>

                      3.) Once you are happy with your .xslx file and have ensured compliance with the important reminders above, navigate to the application once again and click the upload button below the current database, select the new/updated database you want to replace it with and click “Enter” or “Open”.
                      <div></div>

                      4.) Please refresh the page and log back in to check for any errors by scrolling down below the download and upload buttons.
                      <div></div>

                      5.) If no errors are present, please scroll through the database that is displayed above to ensure you are satisfied with your changes.
                      <div></div>

                      <strong><u>Sidenote/Disclaimer:</u></strong> If these changes were made during the semester, rather than before it started; instruct the students to either clear their browser cookies or access QBot via incognito mode on their browser to load the latest changes to the database.
                    </Typography>
                  </Box>
                </Container>
              </Grid>


            </Grid>
          </Box>

        </main>
      </div>
      <div key={"doc-upload"} style={{ display: tabValue === 1 ? '' : 'none' }} >
        <DocumentTable />
      </div>
    </ThemeProvider>
  );
}

export default Edit;