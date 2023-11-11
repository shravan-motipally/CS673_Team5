package com.qbot.answeringservice.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.qbot.answeringservice.dto.CourseDto;
import com.qbot.answeringservice.dto.CourseList;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.service.CourseService;

@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {
    @Mock
    CourseService courseService;
    @InjectMocks
    CourseController courseController;

    @Test
    public void testCreateCourse() {
        Mockito.when(courseService.createCourse(ArgumentMatchers.any(Course.class)))
                .thenReturn(getTestCourses().get(0));

        Course testCourse = new Course(null, "MET", "CS", "633", null, null, null);
        ResponseEntity<Course> response = courseController.createCourse(testCourse);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());

        Course returnedCourse = response.getBody();
        Assertions.assertNotNull(returnedCourse);
    }

    @Test
    public void testCreateCourseThrowException() {
        Mockito.when(courseService.createCourse(ArgumentMatchers.any(Course.class)))
                .thenThrow(new IllegalArgumentException());

        Course testCourse = new Course(null, "MET", "CS", "633", null, null, null);
        ResponseEntity<Course> response = courseController.createCourse(testCourse);
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testGetAllCourses() {
        Mockito.when(courseService.getAllCourses()).thenReturn(getTestCourseDtos());

        ResponseEntity<CourseList> response = courseController.getCourses(null);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());

        CourseList returnedCourses = response.getBody();
        Assertions.assertNotNull(returnedCourses);
        Assertions.assertFalse(returnedCourses.getCourses().isEmpty());
    }

    @Test
    public void testGetCoursesByIds() {
        Mockito.when(courseService.getSpecificCourses(ArgumentMatchers.any())).thenReturn(getTestCourseDtos());

        ResponseEntity<CourseList> response = courseController.getCourses(new String[] { "1" });
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());

        CourseList returnedCourses = response.getBody();
        Assertions.assertNotNull(returnedCourses);
        Assertions.assertFalse(returnedCourses.getCourses().isEmpty());
    }

    @Test
    public void testGetAllCoursesThrowException() {
        Mockito.when(courseService.getAllCourses()).thenThrow(new IllegalArgumentException());

        ResponseEntity<CourseList> response = courseController.getCourses(null);
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testGetCoursesByIdThrowException() {
        Mockito.when(courseService.getSpecificCourses(ArgumentMatchers.any())).thenThrow(new IllegalArgumentException());

        ResponseEntity<CourseList> response = courseController.getCourses(new String[] {});
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testUpdateCourse() {
        Mockito.when(courseService.updateCourse(ArgumentMatchers.any(Course.class)))
                .thenReturn(getTestCourses().get(0));

        Course testCourse = new Course(null, "MET", "CS", "633", null, null, null);
        ResponseEntity<Course> response = courseController.updateCourse(testCourse);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());

        Course returnedCourse = response.getBody();
        Assertions.assertNotNull(returnedCourse);
    }

    @Test
    public void testUpdateCourseThrowException() {
        Mockito.when(courseService.updateCourse(ArgumentMatchers.any(Course.class)))
                .thenThrow(new IllegalArgumentException());

        Course testCourse = new Course(null, "MET", "CS", "633", null, null, null);
        ResponseEntity<Course> response = courseController.updateCourse(testCourse);
        Assertions.assertFalse(response.getStatusCode().is2xxSuccessful());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    public void testDeleteCourseThrowException() {
        ResponseEntity<Course> response = courseController.deleteCourse("");
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
        Assertions.assertTrue(HttpStatus.OK.value() == response.getStatusCodeValue());
        Mockito.verify(courseService, Mockito.times(1)).deleteCourse(ArgumentMatchers.anyString());

    }

    private List<Course> getTestCourses() {
        List<Course> testCourses = new ArrayList<>();
        Course firstCourse = new Course("1", "MET", "CS", "633", null, null, null);
        testCourses.add(firstCourse);

        return testCourses;
    }

    private CourseList getTestCourseDtos() {
        return new CourseList(getTestCourses().stream().map(CourseDto::from).collect(Collectors.toList()));
    }
}
