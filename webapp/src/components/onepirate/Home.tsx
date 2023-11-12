import * as React from 'react';
import ProductCategories from './modules/views/ProductCategories';
import ProductSmokingHero from './modules/views/ProductSmokingHero';
import AppFooter from './modules/views/AppFooter';
import LandingPage from './modules/views/LandingPage';
import ProductValues from './modules/views/ProductValues';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import ProductCTA from './modules/views/ProductCTA';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {getAllCoursesForSelection, getAllQnA} from "../../api/QuestionAnswerApi";
import {ScreenContext} from "../../App";
import {Alert, Box, FormHelperText, MenuItem, Select, ThemeProvider, Tooltip} from "@mui/material";
import {darkTheme, lightTheme} from "../../utils/Themes";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export interface Course {
  courseId: string,
  name: string,
  shortName: string,
  department: string,
  description: string
}

export interface CourseList {
  courses: Array<Course>
}

function Index() {
  const [classSelected, setClassSelected] = useState<string>();
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [classes, setClasses] = useState<Array<Course>>([]);
  const [courseError, setCourseError] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      if (loading) {
        const { exchanges } = await getAllQnA();
        const { courses } = await getAllCoursesForSelection();
        setClasses(courses);
        if (courses.length === 0) {
          setCourseError(true);
        }
        setLoading(false);
        if (exchanges != null && exchanges.length != 0) {
          setScreenState({...screenState, exchanges: exchanges, screen: 'landing page'})
        } else {
          setScreenState({...screenState, exchanges: [], screen: 'error', isError: true});
        }
      }
    })();
  }, [loading])

  useEffect(() => {
    if (screenState.screen === "loading") {
      setLoading(true);
    }
  }, [screenState]);

  const getClassName = useCallback((courseId: string) => {
    const course = classes.find(course => course.courseId === courseId)
    if (course !== undefined) {
      return course.shortName;
    } else {
      return null;
    }
  }, [classes]);

  const coursesMenuList = useMemo(() => {
    return classes.map(course =>
      <MenuItem key={course.courseId} value={course.courseId}>{course.name}</MenuItem>
    )
  }, [classes]);

  const handleClassChange = useCallback((classSel: string) => {
    setClassSelected(classSel);
    setScreenState({
      ...screenState,
      currentClass: classSel,
      currentClassName: getClassName(classSel),
      screen: 'home'
    })
  }, [screenState, classSelected]);

  return (
    <React.Fragment>
      <AppAppBar />
      { loading ? <Alert style={{ marginTop: "40px" }} variant="filled" severity="warning">Loading the backend, please wait!</Alert> : <div/>}
      <LandingPage />
      <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme} >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
          <FormControl variant={"filled"} sx={{m: 1, minWidth: 250}} size={"medium"} error={courseError}>
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
      <ProductSmokingHero />
    </React.Fragment>
  );
}

export default withRoot(Index);
