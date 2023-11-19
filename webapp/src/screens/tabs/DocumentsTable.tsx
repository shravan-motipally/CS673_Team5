import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from "@mui/material/Toolbar";
import {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {
  bulkUploadCourses,
  createNewCourse,
  deleteCourse,
  getAllCoursesForAdministration,
  updateQuestions
} from "../../api/QuestionAnswerApi";
import {
  Alert,
  alpha,
  Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton,
  Stack,
  TablePagination,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import {AlertTitle} from "@mui/lab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import Button from "@mui/material/Button";
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import TextField from "@mui/material/TextField";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as excel from "xlsx";
import {
  courseExcelSettings,
  coursesSpreadSheetData, transformCoursesToJson,
  transformToJson
} from "../../utils/ExcelUtils";
import xlsx from "json-as-xlsx";
import DownloadIcon from '@mui/icons-material/Download';
import {CourseDoc} from "./ClassesTable";

export interface Item {
  id: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    maxHeight: '100px',
    fontSize: 14,
    textOverflow: 'ellipsis',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  marginLeft: 'auto',
  ".MuiTablePagination-displayedRows": {
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
  },
  ".MuiTablePagination-selectLabel": {
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
  },
}));

function createData<T extends Item>(
  id: string,
  item: T
): T {
  return {
    ...item,
  }
}

interface HeadCell<T extends Item> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell<Item>[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Id',
  }
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof Item>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: string },
  b: { [key in Key]: string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps<T extends Item> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string | number | symbol;
  rowCount: number;
}

function EnhancedTableHead<T extends Item>(props: EnhancedTableProps<T>) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



const isNullOrUndefined = (str: string | undefined) => {
  return str === undefined || str === null || str === "";
}

interface CourseDialogProps {
  handleClose: () => void;
  openNewCourseDialog: boolean;
  course?: CourseDoc;
}
const CourseDialog = (props: CourseDialogProps) => {
  const { handleClose, openNewCourseDialog, course } = props;
  const [schoolId, setSchoolId] = useState<string>();
  const [departmentId, setDepartmentId] = useState<string>();
  const [catalogId, setCatalogId] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [semester, setSemester] = useState<string>();

  const [schoolIdError, setSchoolIdError] = useState<boolean>(false);
  const [departmentIdError, setDepartmentIdError] = useState<boolean>(false);
  const [catalogIdError, setCatalogIdError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [semesterError, setSemesterError] = useState<boolean>(false);

  const [newCourseCreationError, setNewCourseCreationError] = useState<boolean>(false);

  const validateCourseFields = useCallback(() => {
    let issueFound = false;
    if (isNullOrUndefined(description)) {
      issueFound = true;
      setDescriptionError(true);
    } else if (isNullOrUndefined(name)) {
      issueFound = true;
      setNameError(true);
    } else if (isNullOrUndefined(schoolId)) {
      issueFound = true;
      setSchoolIdError(true);
    } else if (isNullOrUndefined(semester)) {
      issueFound = true;
      setSemesterError(true);
    } else if (isNullOrUndefined(departmentId)) {
      issueFound = true;
      setDepartmentIdError(true);
    } else if (isNullOrUndefined(catalogId)) {
      issueFound = true;
      setCatalogIdError(true);
    }
    return !issueFound;
  }, [schoolIdError, departmentIdError, catalogIdError, nameError, descriptionError, semesterError,
    schoolId, departmentId, catalogId, name, description, semester]);

  const resetErrorFields = useCallback(() => {
    setDescriptionError(false);
    setNameError(false);
    setSchoolIdError(false);
    setSemesterError(false);
    setDepartmentIdError(false);
    setCatalogIdError(false);
  }, [schoolIdError, departmentIdError, catalogIdError, nameError, descriptionError, semesterError]);

  const handleAddingCourse = useCallback(() => {
    (async () => {
      if (validateCourseFields()) {
        resetErrorFields();
        const coursePartial: Partial<CourseDoc> = {
          id: course === undefined ? undefined : course.id,
          schoolId: schoolId ? schoolId: "",
          departmentId: departmentId ? departmentId: "",
          catalogId: catalogId ? catalogId: "",
          name: name ? name: "",
          description: description ? description: "",
          semester: semester ? semester : ""
        }
        try {
          const successful = await createNewCourse(coursePartial);
          if (!successful) {
            setNewCourseCreationError(true);
          }
          handleClose();
        } catch (e) {
          setNewCourseCreationError(true);
        }
      }
    })();
  }, [course, semester, name, description, catalogId, schoolId, departmentId])

  const openDialog = useMemo(() => openNewCourseDialog, [openNewCourseDialog]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setName(e.target.value);
  }, [name, nameError]);

  const handleSemesterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSemesterError(false);
    setSemester(e.target.value);
  }, [semester, semesterError]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionError(false);
    setDescription(e.target.value);
  }, [catalogId, descriptionError]);

  const handleCatalogIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalogIdError(false);
    setCatalogId(e.target.value);
  }, [catalogId, catalogIdError]);

  const handleDepartmentIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentIdError(false);
    setDepartmentId(e.target.value);
  }, [departmentId, departmentIdError]);

  const handleSchoolIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolIdError(false);
    setSchoolId(e.target.value);
  }, [schoolId, schoolIdError]);

  useEffect(() => {
    if (course !== null && course !== undefined) {
      setName(course.name);
      setSemester(course.semester);
      setDescription(course.description);
      setCatalogId(course.catalogId);
      setDepartmentId(course.departmentId);
      setSchoolId(course.schoolId);
    } else if (course === null || course === undefined) {
      setName("");
      setSemester("");
      setDescription("");
      setCatalogId("");
      setDepartmentId("");
      setSchoolId("");
    }
  }, [course]);

  return (
    <Dialog open={openDialog} onClose={handleClose}>
      {newCourseCreationError ?
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          There was an issue creating the course — <strong>Cancel</strong> for now please!
        </Alert> : <div/>}
      <DialogTitle>{course !== undefined ? "Update" : "Add"} New Course</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the following fields to {course !== undefined ? "update the" : "create a new"} course.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="semester"
          // label="Semester"
          fullWidth
          variant="standard"
          value={semester ?? ''}
          onChange={handleSemesterChange}
          error={semesterError}
          helperText={"Enter a semester in (Fall|Spring|Summer) YYYY format, ex: Fall 2023"}
        />
        <TextField
          autoFocus
          margin="dense"
          id="schoolId"
          // label="School"
          fullWidth
          variant="standard"
          value={schoolId ?? ''}
          onChange={handleSchoolIdChange}
          error={schoolIdError}
          helperText={"Enter school of the course. Ex: MET"}
        />
        <TextField
          autoFocus
          margin="dense"
          id="departmentId"
          // label="Department"
          fullWidth
          variant="standard"
          value={departmentId ?? ''}
          onChange={handleDepartmentIdChange}
          error={departmentIdError}
          helperText={"Enter departmentId of the course. Ex: CS "}
        />
        <TextField
          autoFocus
          margin="dense"
          id="catalogId"
          // label="Course Number"
          fullWidth
          variant="standard"
          value={catalogId ?? ''}
          onChange={handleCatalogIdChange}
          error={catalogIdError}
          helperText={"Enter the course number of the course. Ex: 633"}
        />
        <TextField
          autoFocus
          margin="dense"
          id="course"
          // label="Course Name"
          fullWidth
          variant="standard"
          value={name ?? ''}
          onChange={handleNameChange}
          error={nameError}
          helperText={"Enter name of the course. Ex: Software Engineering"}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          // label="Course Description"
          fullWidth
          variant="standard"
          value={description ?? ''}
          onChange={handleDescriptionChange}
          error={descriptionError}
          helperText={"Enter a detailed description of the course."}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddingCourse}>{course !== undefined ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  )
}

export interface TableProps<T extends Item> {
  getAllItems: () => Promise<T[]>;
}

export default function SelectTable<T extends Item>({ getAllItems }: TableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [getItemsError, setGetItemsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');

  const [openNewItemDialog, setOpenNewItemDialog] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();
  const [file, setFile] = useState<File>();

  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(String(property));
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleDeletion = useCallback(() => {
    (async () => {
      if (selected.length !== 0) {
        for (const index in selected) {
          const success = await deleteCourse(selected[index]);
          if (!success) {
            setDeletionError(true);
          } else {
            setLoading(true);
            handleCellSelection(selected[index]);
            break;
          }
        }
      }
    })();
  }, [selected]);

  const handleUpdation = useCallback(() => {
    if (selected.length === 1) {
      const item = items.find(itemP => itemP.id === selected[0]);
      setSelectedItem(item);
      setOpenNewItemDialog(true);
    }
  }, [selected])

  const handleCellSelection = useCallback((id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    if (newSelected.length === 0) {
      // none selected
      setSelectedItem(undefined);
    }
  }, [selected]);

  useEffect(() => {
    (async () => {
      if (loading) {
        const itemsReturned: T[] = await getAllItems();
        if (itemsReturned.length === 0) {
          setGetItemsError(true);
        } else {
          setItems(itemsReturned);
        }
        setLoading(false);
      }
    })();
  }, [loading]);

  const rows: T[] = useMemo(() => {
    if (!loading) {
      return items.map((course) => {
        return createData(course.id, course)
      })
    }
    return [];
  }, [items, loading]);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, [page]);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, [items]);

  const isSelected = useCallback((id: string) => selected.indexOf(id) !== -1, [selected]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = useMemo(() => {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  }, [page, rowsPerPage]);


  const visibleRows = React.useMemo(
    () =>
      // @ts-ignore
      stableSort<T>(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const numSelected = useMemo(() => {
    return selected.length
  }, [selected]);

  const handleClose = useCallback(() => {
    setOpenNewItemDialog(false);
    setLoading(true);
  }, []);

  const handleNewCourse = useCallback(() => {
    setOpenNewItemDialog(true);
  }, []);

  const handleBulkUpload = useCallback(() => {

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
            const jsonData = { courses: [] } // TODO [];
            (async () => {
              const success = true // TODO;
              if (!success) {
                setError(true);
                setErrorMsg("Unable to save courses at the moment, please try again later")
              }
              setItems(jsonData.courses);
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

  const downloadExcel = useCallback(() => {
    const data = coursesSpreadSheetData;
    // @ts-ignore
    data[0].content = items;
    xlsx(data, courseExcelSettings);
  }, [items]);


  return (
    <Box sx={{ width:"100% "}}>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          {getItemsError || deletionError ?
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue {getItemsError ? "pulling courses" : "deleting courses"} — <strong>Refresh your page!</strong>
            </Alert> : <div/>}
          {error ?
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue uploading your classes — <strong>{errorMsg}</strong>
            </Alert> : <div/>
          }
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(numSelected > 0 && {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              }),
            }}
          >
            {numSelected > 0 ? (
              <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {numSelected} selected
              </Typography>
            ) : (
              <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Classes
              </Typography>
            )}
            {numSelected > 0 ? (
              <>
                {numSelected === 1 ?
                  <Tooltip title="Update">
                    <IconButton onClick={handleUpdation}>
                      <BuildIcon />
                    </IconButton>
                  </Tooltip>: <div/>}
                <Tooltip title="Delete">
                  <IconButton onClick={handleDeletion}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={2}>
                  <Button size="small" onClick={handleNewCourse} startIcon={<AddIcon />}>Course</Button>
                  <Button size="small" component="label" onClick={handleBulkUpload} startIcon={<UploadFileIcon />}>
                    <input type="file" hidden onChange={onFileChange}/>Upload
                  </Button>
                  <Button size="small" onClick={downloadExcel} startIcon={<DownloadIcon />}>Download</Button>
                </Stack>
              </>
            )}
          </Toolbar>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">

            <EnhancedTableHead orderBy={orderBy}
              numSelected={selected.length}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row: T, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleCellSelection(row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </StyledTableCell>

                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <StyledTableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <CourseDialog openNewCourseDialog={openNewItemDialog} handleClose={handleClose} course={undefined}/>

    </Box>
  );
}