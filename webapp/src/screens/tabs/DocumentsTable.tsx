import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  deleteDocument,
  getAllDocumentsForCourse,
} from "../../api/ExchangeApi";
import {
  Alert,
  alpha,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TablePagination,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { AlertTitle } from "@mui/lab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { ScreenContext } from "../../App";
import { Course } from "../../components/onepirate/Home";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useDropzone } from "react-dropzone";
import LinearProgress from "@mui/material/LinearProgress";
import axios, { AxiosProgressEvent } from "axios";
import { uploadDocumentsUrl } from "../../utils/Urls";
import Divider from "@mui/material/Divider";

export interface Item {
  id: string;
}

export interface Document extends Item {
  courseId: string;
  name: string;
}

export interface DocumentList {
  documents: Array<Document> | undefined;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    maxHeight: "100px",
    fontSize: 14,
    textOverflow: "ellipsis",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  marginLeft: "auto",
  ".MuiTablePagination-displayedRows": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
  },
  ".MuiTablePagination-selectLabel": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
  },
}));

interface datum {
  id: string;
  courseId: string | number;
  name: string | number;
}

function createData<T extends Item>(id: string, item: T): T {
  return {
    ...item,
  };
}

interface HeadCell<T extends Item> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell<Document>[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Id",
  },
  {
    id: "courseId",
    numeric: false,
    disablePadding: true,
    label: "Course Id",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "File Name",
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

type Order = "asc" | "desc";

function getComparator<Key extends keyof datum>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: string }, b: { [key in Key]: string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
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
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof datum
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string | number | symbol;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
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
              "aria-label": "select all documents",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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
};

export default function DocumentTable() {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [items, setItems] = useState<Document[]>([]);
  const [getItemsError, setGetItemsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("id");

  const [openNewItemDialog, setOpenNewItemDialog] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Document | undefined>();
  const [file, setFile] = useState<File>();

  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof datum
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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
          const success = await deleteDocument(selected[index]);
          if (!success) {
            setDeletionError(true);
            break;
          } else {
            setLoading(true);
            handleCellSelection(selected[index]);
          }
        }
      }
    })();
  }, [selected]);

  const handleCellSelection = useCallback(
    (id: string) => {
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
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
      if (newSelected.length === 0) {
        // none selected
        setSelectedItem(undefined);
      }
    },
    [selected]
  );

  useEffect(() => {
    (async () => {
      if (loading) {
        const courseDoc: Course | null = screenState.currentClassObject;
        const documentList: DocumentList =
          courseDoc != null && courseDoc?.courseId != null
            ? await getAllDocumentsForCourse(courseDoc?.courseId)
            : { documents: [] };
        const { documents: itemsReturned } = documentList;
        if (itemsReturned === undefined) {
          setGetItemsError(true);
        } else {
          setItems(itemsReturned);
        }
        setLoading(false);
      }
    })();
  }, [loading, screenState]);

  const rows: datum[] = useMemo(() => {
    if (!loading) {
      return items.map((item) => {
        return createData(item.id, item);
      });
    }
    return [];
  }, [items, loading]);

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage);
    },
    [page]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [items]
  );

  const isSelected = useCallback(
    (id: string) => selected.indexOf(id) !== -1,
    [selected]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = useMemo(() => {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  }, [page, rowsPerPage]);

  const visibleRows = React.useMemo(
    () =>
      // @ts-ignore
      stableSort<T>(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const numSelected = useMemo(() => {
    return selected.length;
  }, [selected]);

  const [uploadError, setUploadError] = useState<boolean>(false);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (
        screenState.currentClassObject === null ||
        screenState.currentClassObject.courseId === null
      ) {
        setUploadError(true);
      }
      if (
        acceptedFiles.length === 1 &&
        acceptedFiles[0].type === "application/pdf"
      ) {
        (async () => {
          const formData = new FormData();
          formData.append("file", acceptedFiles[0]);
          formData.append(
            "courseId",
            screenState.currentClassObject?.courseId ?? ""
          );
          let isSuccessful = false;
          try {
            const res = await axios({
              timeout: 300000,
              url: uploadDocumentsUrl(),
              method: "POST",
              data: formData,
              headers: {
                "content-type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const percent =
                  progressEvent.total !== undefined
                    ? Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                      )
                    : 0;
                if (percent >= 100) {
                  setProgress(100);
                } else {
                  setProgress(percent);
                }
              },
            });
            isSuccessful = true;
          } catch (err) {
            console.log(
              "Backend is down or questions API returned an exception: " + err
            );
            setProgress(0);
          }

          if (isSuccessful) {
            setUploadError(false);
            setLoading(true);
          } else {
            setUploadError(true);
          }
        })();
      }
    },
    [screenState]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    onDrop,
    maxFiles: 1,
  });

  return (
    <Box sx={{ width: "100% " }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 0,
          pb: 2,
        }}
      >
        <div {...getRootProps()}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Container
                maxWidth="md"
                sx={{
                  marginLeft: 0,
                  marginTop: "10px",
                  border: "black dotted 1px",
                  backgroundColor: "#d3d3d3",
                  width: "70vw",
                }}
              >
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  maxWidth="md"
                >
                  Drag 'n' drop one file at a time here, or click to select one file to upload
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  maxWidth="md"
                >
                  {"(Only small (<10MB) *.pdf's will be accepted)"}
                </Typography>
                <input {...getInputProps()} />
              </Container>
            </Grid>
          </Grid>
        </div>
        <Divider />

        {progress !== 0 ? (
          <LinearProgress variant={"determinate"} value={progress} />
        ) : (
          <div />
        )}
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          {uploadError ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue uploading your document —{" "}
              <strong>Refresh your page!</strong>
            </Alert>
          ) : (
            <div />
          )}
          {getItemsError || deletionError ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue{" "}
              {getItemsError
                ? "pulling documents"
                : "deleting documents"} — <strong>Refresh your page!</strong>
            </Alert>
          ) : (
            <div />
          )}
          {error ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              There was an issue uploading your documents —{" "}
              <strong>{errorMsg}</strong>
            </Alert>
          ) : (
            <div />
          )}
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(numSelected > 0 && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            {numSelected > 0 ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {numSelected} selected
              </Typography>
            ) : (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Documents
              </Typography>
            )}
            {numSelected > 0 ? (
              <>
                <Tooltip title="Delete">
                  <IconButton onClick={handleDeletion}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <></>
            )}
          </Toolbar>
          <Table sx={{ minWidth: 700 }} aria-label="customized document table">
            <EnhancedTableHead
              orderBy={orderBy}
              numSelected={selected.length}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row: datum, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-doctable-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleCellSelection(row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.courseId}
                    </StyledTableCell>
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
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
    </Box>
  );
}
