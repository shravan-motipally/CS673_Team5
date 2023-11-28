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
  userExcelSettings,
  usersSpreadSheetData,
  transformUsersToJson,
} from "../../utils/ExcelUtils";
import xlsx from "json-as-xlsx";
import DownloadIcon from '@mui/icons-material/Download';
import { bulkUploadUsers, createNewUser, deleteUser, getAllUsers } from '../../api/UserApi';

export interface UserDoc {
  id: string,
  loginId: string,
  firstName: string,
  lastName: string,
  username: string,
  emailAddress: string,
  roleNames: string[],
  courseIds: string[],
  photoUrl: string,
}

export interface UserRequest {
  id: string,
  firstName: string,
  lastName: string,
  loginDetail: LoginDetail,
  emailAddress: string,
  roleNames: string[],
  courseIds: string[],
  photoUrl: string,
}

export interface LoginDetail {
  username: string,
  password: string
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
  login: string | number,
  firstName: string | number,
  lastName: string | number,
  username: string | number,
  emailAddress: string | number,
  roleNames: string | number,
  courseIds: string | number,
  photo: string | number,

}

function createData(
    id: string,
    user: UserDoc
): datum {
  return {
    id: id,
    login: user.loginId,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    emailAddress: user.emailAddress,
    roleNames: user.roleNames ? user.roleNames.join(',') : "",
    courseIds: user.courseIds ? user.courseIds.join(',') : "",
    photo: user.photoUrl
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
    id: 'firstName',
    numeric: false,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'emailAddress',
    numeric: false,
    disablePadding: false,
    label: 'Email Address',
  },
  {
    id: 'username',
    numeric: false,
    disablePadding: false,
    label: 'Username',
  },
  {
    id: 'roleNames',
    numeric: false,
    disablePadding: false,
    label: 'Roles',
  },
  {
    id: 'courseIds',
    numeric: false,
    disablePadding: false,
    label: 'Course Ids',
  },
  {
    id: 'photo',
    numeric: false,
    disablePadding: false,
    label: 'Photo',
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

interface UserDialogProps {
  handleClose: () => void;
  openNewUserDialog: boolean;
  user?: UserDoc;
}

const isNullOrUndefined = (str: string | undefined) => {
  return str === undefined || str === null || str === "";
}

const UserDialog = (props: UserDialogProps) => {
  const { handleClose, openNewUserDialog, user } = props;
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [emailAddress, setEmailAddress] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [roleNames, setRoleNames] = useState<string>();
  const [courseIds, setCourseIds] = useState<string>();
  const [photoUrl, setPhotoUrl] = useState<string>();

  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [emailAddressError, setEmailAddressError] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [roleNamesError, setRoleNamesError] = useState<boolean>(false);
  const [courseIdsError, setCourseIdsError] = useState<boolean>(false);
  const [photoUrlError, setPhotoUrlError] = useState<boolean>(false);

  const [newUserCreationError, setNewUserCreationError] = useState<boolean>(false);

  const validateUserFields = useCallback(() => {
    let issueFound = false;
    if (isNullOrUndefined(firstName)) {
      issueFound = true;
      setFirstNameError(true);
    } else if (isNullOrUndefined(lastName)) {
      issueFound = true;
      setLastNameError(true);
    }else if (isNullOrUndefined(emailAddress)) {
      issueFound = true;
      setEmailAddressError(true);
    } else if (isNullOrUndefined(username)) {
      issueFound = true;
      setUsernameError(true);
    } else if (isNullOrUndefined(roleNames)) {
      issueFound = true;
      setRoleNamesError(true);
    }
    return !issueFound;
  }, [photoUrlError, emailAddressError, usernameError, firstNameError, lastNameError, roleNamesError, courseIdsError,
    photoUrl, emailAddress, username, firstName, lastName, roleNames, courseIds]);

  const resetErrorFields = useCallback(() => {
    setFirstNameError(false);
    setLastNameError(false);
    setEmailAddressError(false);
    setUsernameError(false);
    setRoleNamesError(false);
    setCourseIdsError(false);
    setPhotoUrlError(false);
    
  }, [photoUrlError, usernameError, firstNameError, lastNameError, roleNamesError, courseIdsError]);

  const handleAddingUser = useCallback(() => {
    (async () => {
      if (validateUserFields()) {
        resetErrorFields();
        const userPartial: Partial<UserDoc> = {
          id: user === undefined ? undefined : user.id,
          firstName: firstName ? firstName: "",
          lastName: lastName ? lastName: "",
          emailAddress: emailAddress ? emailAddress : "",
          username: username ? username: "",
          roleNames: roleNames ? roleNames.split(","): [],
          courseIds: courseIds ? courseIds.split(",") : [],
          photoUrl: photoUrl ? photoUrl: "",
        }
        try {
          const successful = await createNewUser(userPartial);
          if (!successful) {
            setNewUserCreationError(true);
          }
          handleClose();
        } catch (e) {
          setNewUserCreationError(true);
        }
      }
    })();
  }, [user, courseIds, lastName, roleNames, firstName, photoUrl, emailAddress, username])

  const openDialog = useMemo(() => openNewUserDialog, [openNewUserDialog]);

  const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNameError(false);
    setFirstName(e.target.value);
  }, [firstName, firstNameError]);

  const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLastNameError(false);
    setLastName(e.target.value);
  }, [lastName, lastNameError]);

  const handleEmailAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddressError(false);
    setEmailAddress(e.target.value);
  }, [emailAddress, emailAddressError]);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameError(false);
    setUsername(e.target.value);
  }, [username, usernameError]);

  const handleRoleNamesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleNamesError(false);
    setRoleNames(e.target.value);
  }, [roleNames, roleNamesError]);

  const handleCourseIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseIdsError(false);
    setCourseIds(e.target.value);
  }, [courseIds, courseIdsError]);

  const handlePhotoUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoUrlError(false);
    setPhotoUrl(e.target.value);
  }, [photoUrl, photoUrlError]);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmailAddress(user.emailAddress);
      setUsername(user.username);
      setCourseIds(user.courseIds ? user.courseIds.join(',') : "");
      setRoleNames(user.roleNames.join(','));
      setPhotoUrl(user.photoUrl);
    } else if (user === null || user === undefined) {
      setFirstName("");
      setLastName("");
      setEmailAddress("");
      setUsername("");
      setCourseIds("");
      setRoleNames("");
      setPhotoUrl("");
    }
  }, [user]);

  return (
      <Dialog open={openDialog} onClose={handleClose}>
        {newUserCreationError ?
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue creating the user — <strong>Cancel</strong> for now please!
            </Alert> : <div/>}
        <DialogTitle>{user !== undefined ? "Update" : "Add New"} User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the following fields to {user !== undefined ? "update the" : "create a new"} user.
          </DialogContentText>
          <TextField
              autoFocus
              margin="dense"
              id="firstName"
              fullWidth
              variant="standard"
              value={firstName ?? ''}
              onChange={handleFirstNameChange}
              error={firstNameError}
              helperText={"First name"}
          />
          <TextField
              autoFocus
              margin="dense"
              id="lastName"
              fullWidth
              variant="standard"
              value={lastName ?? ''}
              onChange={handleLastNameChange}
              error={lastNameError}
              helperText={"Last Name"}
          />
          <TextField
              autoFocus
              margin="dense"
              id="emailAddress"
              fullWidth
              variant="standard"
              value={emailAddress ?? ''}
              onChange={handleEmailAddressChange}
              error={emailAddressError}
              helperText={"Email Address"}
          />
          <TextField
              autoFocus
              margin="dense"
              id="username"
              fullWidth
              variant="standard"
              value={username ?? ''}
              onChange={handleUsernameChange}
              error={usernameError}
              helperText={"Username (if different from Email Address)"}
          />
          <TextField
              autoFocus
              margin="dense"
              id="roleIds"
              fullWidth
              variant="standard"
              value={roleNames ?? ''}
              onChange={handleRoleNamesChange}
              error={roleNamesError}
              helperText={"User Roles (comma-separated)"}
          />
          <TextField
              autoFocus
              margin="dense"
              id="courseIds"
              fullWidth
              variant="standard"
              value={courseIds ?? ''}
              onChange={handleCourseIdChange}
              error={courseIdsError}
              helperText={"Course Ids (comma-separated)"}
          />
          <TextField
              autoFocus
              margin="dense"
              id="photoId"
              fullWidth
              variant="standard"
              value={photoUrl ?? ''}
              onChange={handlePhotoUrlChange}
              error={photoUrlError}
              helperText={"Profile Picture URL"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddingUser}>{user !== undefined ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
  )
}

export default function UsersTable() {
  const [classes, setClasses] = useState<UserDoc[]>([]);
  const [getClassesError, setGetClassesError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof datum>('lastName');

  const [openNewUserDialog, setOpenNewUserDialog] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDoc | undefined>();
  const [file, setFile] = useState<File>();

  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

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
          const success = await deleteUser(selected[index]);
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
      const user = classes.find(user => user.id === selected[0]);
      setSelectedUser(user);
      setOpenNewUserDialog(true);
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
      setSelectedUser(undefined);
    }
  }, [selected]);

  useEffect(() => {
    (async () => {
      if (loading) {
        const users: UserDoc[] = await getAllUsers();
        if (users.length === 0) {
          setGetClassesError(true);
        } else {
          setClasses(users);
        }
        setLoading(false);
      }
    })();
  }, [loading]);

  const rows: datum[] = useMemo(() => {
    if (!loading) {
      return classes.map((user) => {
        return createData(user.id, user)
      })
    }
    return [];
  }, [classes, loading]);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, [page]);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, [classes]);

  const isSelected = useCallback((id: string) => selected.indexOf(id) !== -1, [selected]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = useMemo(() => {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  }, [page, rowsPerPage]);

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
    setOpenNewUserDialog(false);
    setLoading(true);
  }, []);

  const handleNewUser = useCallback(() => {
    setOpenNewUserDialog(true);
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
            const jsonData = transformUsersToJson(dataParse);
            (async () => {
              const success = await bulkUploadUsers(jsonData);
              if (!success) {
                setError(true);
                setErrorMsg("Unable to save users at the moment, please try again later")
              }
              // @ts-ignore
              setClasses(jsonData.courses);
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
    const data = usersSpreadSheetData;
    // @ts-ignore
    data[0].content = classes;
    xlsx(data, userExcelSettings);
  }, [classes]);

  return (
      <Box sx={{ width:"100% "}}>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            {getClassesError || deletionError ?
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  There was an issue {getClassesError ? "pulling users" : "deleting users"} — <strong>Refresh your page!</strong>
                </Alert> : <div/>}
            {error ?
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  There was an issue uploading your users — <strong>{errorMsg}</strong>
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
                    Users
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
                      <Button size="small" onClick={handleNewUser} startIcon={<AddIcon />}>User</Button>
                      <Button size="small" component="label" onClick={handleBulkUpload} startIcon={<UploadFileIcon />}>
                        <input type="file" hidden onChange={onFileChange}/>Upload
                      </Button>
                      <Button size="small" onClick={downloadExcel} startIcon={<DownloadIcon />}>Download</Button>
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
                            padding="normal"
                            align="left"
                        >
                          {row.firstName}
                        </StyledTableCell>
                        <StyledTableCell align="right">{row.lastName}</StyledTableCell>
                        <StyledTableCell align="right">{row.emailAddress}</StyledTableCell>
                        <StyledTableCell align="right">{row.username}</StyledTableCell>
                        <StyledTableCell align="right">{row.roleNames}</StyledTableCell>
                        <StyledTableCell align="right">{row.courseIds}</StyledTableCell>
                        <StyledTableCell align="right">{row.photo}</StyledTableCell>
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
        <UserDialog openNewUserDialog={openNewUserDialog} handleClose={handleClose} user={selectedUser}/>

      </Box>
  );
}