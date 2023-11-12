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
import {useCallback, useEffect, useMemo, useState} from "react";
import {createNewCourse, deleteCourse, getAllCoursesForAdministration} from "../../api/QuestionAnswerApi";
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

export interface CourseDoc {
  id: string,
  schoolId: string,
  departmentId: string,
  catalogId: string,
  name: string,
  description: string,
  semester: string
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

interface datum {
  id: string,
  name: string | number,
  school: string | number,
  department: string | number,
  course: string | number,
  semester: string | number,
}

function createData(
  id: string,
  course: CourseDoc
): datum {
  return {
    id,
    name: course.name,
    school: course.schoolId,
    department: course.departmentId,
    course: course.catalogId,
    semester: course.semester
  }
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof datum;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'school',
    numeric: false,
    disablePadding: false,
    label: 'School',
  },
  {
    id: 'department',
    numeric: false,
    disablePadding: false,
    label: 'Department',
  },
  {
    id: 'course',
    numeric: true,
    disablePadding: false,
    label: 'Course',
  },
  {
    id: 'semester',
    numeric: false,
    disablePadding: false,
    label: 'Semester',
  },
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

function getComparator<Key extends keyof datum>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
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

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof datum) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof datum) => (event: React.MouseEvent<unknown>) => {
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

interface CourseDialogProps {
  handleClose: () => void;
  openNewCourseDialog: boolean;
  course?: CourseDoc;
}

const isNullOrUndefined = (str: string | undefined) => {
  return str === undefined || str === null;
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
  }, [schoolIdError, departmentIdError, catalogIdError, nameError, descriptionError, semesterError])

  const handleAdditionSemester = useCallback(() => {
    (async () => {
      if (validateCourseFields()) {
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
          setSemester("");
          setDescription("");
          setName("");
          setCatalogId("");
          setSchoolId("");
          setDepartmentId("");
          handleClose();
        } catch (e) {
          setNewCourseCreationError(true);
        }
      }
    })();
  }, [course, semester, name, description, catalogId, schoolId, departmentId])

  const openDialog = useMemo(() => openNewCourseDialog, [openNewCourseDialog]);

  useEffect(() => {
    if (course !== null && course !== undefined) {
      setName(course.name);
      setSemester(course.semester);
      setDescription(course.description);
      setCatalogId(course.catalogId);
      setDepartmentId(course.departmentId);
      setSchoolId(course.schoolId);
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
          label="Semester"
          fullWidth
          variant="standard"
          value={semester}
          onChange={(e) => {
            setSemesterError(false);
            setSemester(e.target.value);
          }}
          error={semesterError}
          helperText={semesterError ? "Enter a semester in (Fall|Spring|Summer) YYYY format, ex: Fall 2023" : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="schoolId"
          label="School"
          fullWidth
          variant="standard"
          value={schoolId}
          onChange={(e) => {
            setSchoolIdError(false);
            setSchoolId(e.target.value);
          }}
          error={schoolIdError}
          helperText={schoolIdError ? "Enter school of the course. Ex: MET" : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="departmentId"
          label="Department"
          fullWidth
          variant="standard"
          value={departmentId}
          onChange={(e) => {
            setDepartmentIdError(false);
            setDepartmentId(e.target.value);
          }}
          error={departmentIdError}
          helperText={departmentIdError ? "Enter departmentId of the course. Ex: CS " : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="catalogId"
          label="Course Number"
          fullWidth
          variant="standard"
          value={catalogId}
          onChange={(e) => {
            console.log(catalogId);
            setCatalogIdError(false);
            setCatalogId(e.target.value);
          }}
          error={catalogIdError}
          helperText={catalogIdError ? "Enter the course number of the course. Ex: 633" : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="course"
          label="Course Name"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => {
            setNameError(false);
            setName(e.target.value);
          }}
          error={nameError}
          helperText={nameError ? "Enter name of the course. Ex: Software Engineering" : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Course Description"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => {
            setDescriptionError(false);
            setDescription(e.target.value);
          }}
          error={descriptionError}
          helperText={descriptionError ? "Enter a detailed description of the course." : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdditionSemester}>{course !== undefined ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default function ClassesTable() {
  const [classes, setClasses] = useState<CourseDoc[]>([]);
  const [getClassesError, setGetClassesError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof datum>('name');

  const [openNewCourseDialog, setOpenNewCourseDialog] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDoc | undefined>();


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof datum,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
      const course = classes.find(course => course.id === selected[0]);
      setSelectedCourse(course);
      setOpenNewCourseDialog(true);
    }
  }, [selected])

  const handleCellSelection = (id: string) => {
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
  };

  useEffect(() => {
    (async () => {
      if (loading) {
        const courses: CourseDoc[] = await getAllCoursesForAdministration();
        if (courses.length === 0) {
          setGetClassesError(true);
        } else {
          setClasses(courses);
        }
        setLoading(false);
      }
    })();
  }, [loading]);

  const rows: datum[] = useMemo(() => {
    if (!loading) {
      return classes.map((course) => {
        return createData(course.id, course)
      })
    }
    return [];
  }, [classes, loading]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, [classes]);

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort<datum>(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const numSelected = useMemo(() => {
    return selected.length
  }, [selected]);

  const handleClose = useCallback(() => {
    setOpenNewCourseDialog(false);
    setLoading(true);
  }, []);

  const handleNewCourse = useCallback(() => {
    setOpenNewCourseDialog(true);
  }, []);


  return (
    <Box sx={{ width:"100% "}}>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          {getClassesError || deletionError ?
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue {getClassesError ? "pulling courses" : "deleting courses"} — <strong>Refresh your page!</strong>
            </Alert> : <div/>}
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
                </Stack>
              </>
            )}
          </Toolbar>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row: datum, index) => {
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
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.school}</StyledTableCell>
                    <StyledTableCell align="right">{row.department}</StyledTableCell>
                    <StyledTableCell align="right">{row.course}</StyledTableCell>
                    <StyledTableCell align="right">{row.semester}</StyledTableCell>
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
      <CourseDialog openNewCourseDialog={openNewCourseDialog} handleClose={handleClose} course={selectedCourse}/>

    </Box>
  );
}