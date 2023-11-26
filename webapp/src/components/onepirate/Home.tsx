import * as React from 'react';
import ProductCategories from './modules/views/ProductCategories';
import LandingPage from './modules/views/LandingPage';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {getAllCoursesForSelection, getAllQnA, getAllExchangesForCourse} from "../../api/QuestionAnswerApi";
import {ScreenContext} from "../../App";
import {Alert, Box, FormHelperText, MenuItem, Select, ThemeProvider, Tooltip} from "@mui/material";
import {darkTheme, lightTheme} from "../../utils/Themes";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { getGenerationBackendHealth } from '../../api/HealthCheckApi';


export interface Course {
  courseId: string,
  name: string,
  shortName: string,
  department: string,
  description: string
}

export interface CourseList {
  courses: Array<Course> | undefined
}

function Index() {
  const [classSelected, setClassSelected] = useState<string>();
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [classes, setClasses] = useState<Array<Course>>([]);
  const [courseError, setCourseError] = useState<boolean>(false);
  const [docHealth, setDocHealth] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      if (loading) {
        const { courses } = await getAllCoursesForSelection();
        const docSvcStatus = await getGenerationBackendHealth();
        setDocHealth(docSvcStatus);

        if (courses === undefined || courses.length === 0) {
          setCourseError(true);
        }
        setLoading(false);
        if (courses != undefined && courses.length != 0) {
          setClasses(courses);
          setScreenState({...screenState, screen: 'landing page'})
        } else {
          setScreenState({...screenState, screen: 'error', isError: true});
        }
      }
    })();
  }, [loading]);

  useEffect(() => {
    if (screenState.screen === "loading") {
      setLoading(true);
    }
  }, [screenState]);

  const getClass = useCallback((courseId: string) => {
    const course = classes.find(course => course.courseId === courseId)
    if (course !== undefined) {
      return course;
    } else {
      return null;
    }
  }, [classes]);

  const coursesMenuList = useMemo(() => {
    return classes.map(course =>
      <MenuItem key={course.courseId} value={course.courseId}>{course.name}</MenuItem>
    )
  }, [classes]);

  const handleClassChange = useCallback(async (classSel: string) => {
    setClassSelected(classSel);
    const curClass = getClass(classSel);
    if (curClass !== undefined && curClass?.courseId !== undefined && curClass.courseId !== null) {
      const {exchanges} = await getAllExchangesForCourse(curClass.courseId);
      setScreenState({
        ...screenState,
        currentClass: classSel,
        currentClassName: curClass !== null ? curClass.shortName : classSel,
        currentClassObject: getClass(classSel),
        screen: 'home',
        exchanges: exchanges
      })
    }
  }, [screenState, classSelected]);

  return (
    <React.Fragment>
      <AppAppBar loading={loading}/>
      <Alert style={{ display: loading ? '' : 'none' }} variant="filled" severity="warning">
        Generation Capabilities added! Loading times are extended, apologies!  Loading the backend now, please wait!
      </Alert>
      <LandingPage />
      <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme} >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
          <FormControl variant={"outlined"} sx={{m: 1, minWidth: 250}} size={"medium"} error={courseError}>
            <InputLabel id="demo-simple-select-label">Select Your Class</InputLabel>
            <Select
              inputProps={{
                backgroundColor: '#FFFFFF'
              }}
              disabled={loading}
              labelId="class-selection-label-id"
              id="class-selection-id"
              value={classSelected}
              label="Select Your Class"
              onChange={(e) => {
                handleClassChange(e.target.value);
              }}
              error={courseError}

            >
              {coursesMenuList}
            </Select>
            {courseError ? <FormHelperText>⚠️ Error loading courses, refresh your page!</FormHelperText> : <div/> }
          </FormControl>
        </Box>
      </ThemeProvider>
      <ProductCategories />
      <ProductHowItWorks />
    </React.Fragment>
  );
}

export default withRoot(Index);
