package com.qbot.answeringservice.service;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.mongodb.assertions.Assertions;
import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.repository.CourseRepository;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
    @Mock
    CourseRepository courseRepo;

    @InjectMocks
    CourseService courseService;

    @Test
    public void testCreateCourse() {
        Mockito.when(courseRepo.save(ArgumentMatchers.any(Course.class))).thenReturn(getTestCourses().get(0));

        Course createdCourse = new Course("1", "MET", "CS", "633", null, null, null);
        Course returnedCourse = courseService.createCourse(createdCourse);
        Assertions.assertNotNull(returnedCourse);
    }

    @Test
    public void testFindAll() {
        Mockito.when(courseRepo.findAll()).thenReturn(getTestCourses());
        List<Course> foundCourses = courseService.findAllCourses();

        Assertions.assertFalse(foundCourses.isEmpty());
    }

    @Test
    public void testFindByCourseId() {
        Mockito.when(courseRepo.findCoursesByIds(ArgumentMatchers.any())).thenReturn(getTestCourses());
        List<Course> foundCourses = courseService.findByCourseIds(new String[] { "1", "2" });

        Assertions.assertFalse(foundCourses.isEmpty());
    }

    @Test
    public void testDeleteCourse() {
        courseService.deleteCourse(new String());
        Mockito.verify(courseRepo, Mockito.times(1)).deleteById(ArgumentMatchers.anyString());
    }

    @Test
    public void testDeleteCourseNullInput() {
        courseService.deleteCourse(null);
        Mockito.verify(courseRepo, Mockito.times(0)).deleteById(ArgumentMatchers.anyString());
    }

    private List<Course> getTestCourses() {
        List<Course> testCourses = new ArrayList<>();
        Course firstCourse = new Course("1", "MET", "CS", "633", null, null, null);
        testCourses.add(firstCourse);

        return testCourses;
    }
}
