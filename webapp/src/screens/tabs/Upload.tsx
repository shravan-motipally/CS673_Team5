import Box from '@mui/system/Box';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

export const Upload = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {

  }, []);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'application/pdf': []
    },
    onDrop,
    maxFiles: 1
  });

  return (
    <main>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 0,
          pb: 2,
        }}
      >
        <div { ...getRootProps() } >
          <Grid container direction="column" alignItems="center" >
            <Grid item>
              <Container maxWidth="md" sx={{
                marginLeft: 0,
                marginTop: "10px",
                border: "black dotted 1px",
                backgroundColor: "#d3d3d3",
                width: "70vw"
              }}>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  maxWidth = "md"
                >
                  Drag 'n' drop some files here, or click to select files
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  maxWidth = "md"
                >
                  (Only *.pdf's will be accepted)
                </Typography>
                <input {...getInputProps()} />
              </Container>
            </Grid>
          </Grid>
        </div>


      </Box>
    </main>
  );
}