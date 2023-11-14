import * as React from 'react';

import Container from '@mui/material/Container';
import {useCallback, useContext, useEffect, useMemo} from "react";
import {ScreenContext} from "../App";
import FormControl from "@mui/material/FormControl";
import {
  FormHelperText,
  MenuItem,
  Select
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {darkTheme, lightTheme} from "../utils/Themes";
import {
  BLOOM,
  DISTIL_GPT2,
  GPT2,
  GPT3_SMALL,
  OPEN_AI,
  PARAPHRASE_MINILM, PARAPHRASE_MINILM_MULTILINGUAL
} from "../utils/Urls";
import InputLabel from "@mui/material/InputLabel";
import {StyledInput} from "../components/StyledInput";
import TextField from "@mui/material/TextField";

const Settings = () => {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const { generativeMode } = screenState;
  const [genModel, setGenModel] = React.useState<string>(GPT2);
  const [paraphraseModel, setParaphraseModel] = React.useState<string>(PARAPHRASE_MINILM);
  const [threshold, setThreshold] = React.useState<string>(String(screenState.semanticSimilarityThreshold));
  const [error, setError] = React.useState<boolean>(false);

  useEffect(() => {
    setGenModel(screenState.generativeModel);
    setParaphraseModel(screenState.semanticSimilarityModel);
  }, [screenState]);

  const paraphraseModels = [PARAPHRASE_MINILM, PARAPHRASE_MINILM_MULTILINGUAL];
  const genModels = [GPT2, BLOOM, DISTIL_GPT2, GPT3_SMALL, OPEN_AI];

  const handleGenerativeModelChange = useCallback((model: typeof genModels[number]) => {
    setGenModel(model);
    setScreenState({
      ...screenState,
      generativeModel: model,
    });
  }, [genModel, screenState, generativeMode]);

  const handleParaphraseModelsChange = useCallback((model: typeof paraphraseModels[number]) => {
    setParaphraseModel(model);
    setScreenState({
      ...screenState,
      semanticSimilarityModel: paraphraseModel,
    });
  }, [paraphraseModel, screenState, generativeMode]);

  const handleGModelClick = useCallback((model: string) => () => {
    handleGenerativeModelChange(model);
  }, [screenState]);

  const handlePModelClick = useCallback((model: string) => () => {
    handleParaphraseModelsChange(model);
  }, [screenState]);

  const handleThresholdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(event.target.value);
    setThreshold(event.target.value);
    if (Number.isNaN(val) || val < 0.01 || val > 1) {
      setError(true);
    } else {
      setError(false);
      setScreenState({
        ...screenState,
        semanticSimilarityThreshold: val < 0.01 ? 0.01 :  val > 1 ? 1 : val,
      })
    }
  }, [screenState]);

  const genModelMenuItems = useMemo(() => {
    return genModels.map(model => (
      <MenuItem key={"Gmodel-" + model} value={model} onClick={handleGModelClick(model)} disableRipple disableTouchRipple  >
        {model}
      </MenuItem>
    ))
  }, [screenState]);

  const paraphraseModelMenuItems = useMemo(() => {
    return paraphraseModels.map(model => (
      <MenuItem key={"Pmodel-" + model} value={model} onClick={handlePModelClick(model)} disableRipple disableTouchRipple  >
        {model}
      </MenuItem>
    ))
  }, [screenState]);



  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 2,
            pb: 2,
          }}
        >
          <Container maxWidth="sm" sx={{
            margin: 0
          }}>
            <FormControl fullWidth variant="standard">
              <InputLabel id="generative-model">Select Generative Model</InputLabel>
              <Select
                labelId="simple-generative-label"
                id="simple-select"
                value={genModel}
                label={"Select Generative Model"}
                input={<StyledInput />}
                onChange={() => {}}
              >
                {genModelMenuItems}
              </Select>
              <FormHelperText>
                Information about the above model can be found by going to the huggingface <a target="_blank" href={`https://huggingface.co/${genModel}`}>{genModel}</a> page.
                {genModel !== BLOOM ? "  Note that generative models take some time to load.  If the model ever reaches 10GB, it will be unusable on this site." : ""}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth variant="standard">
              <InputLabel id="semantic-similatiry-model">Select Semantic Similarity Model</InputLabel>
              <Select
                labelId="simple-semantic-similarity-label"
                id="simple-select"
                value={paraphraseModel}
                label={"Select Semantic Similarity Model"}
                input={<StyledInput />}
              >
                {paraphraseModelMenuItems}
              </Select>
              <FormHelperText>Information about the above model can be found by going to the huggingface <a target="_blank" href={`https://huggingface.co/${paraphraseModel}`}>{paraphraseModel}</a> page</FormHelperText>
            </FormControl>
            <FormControl sx={{ mt: 2 }} fullWidth variant="standard">
              <TextField
                label={"Semantic similarity threshold"}
                id="threshold-setting"
                error={error}
                helperText={error ? "Has to be between 0 and 1": ""}
                type="number"
                variant="outlined"
                value={threshold}
                onChange={handleThresholdChange}
                inputProps={{
                  step: 0.01,
                }}
              />
              <FormHelperText>Defines how close a question asked is to the question being checked against.  Higher number means a tighter match is required.  Ranges from (0-1]</FormHelperText>
            </FormControl>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default Settings;