package com.qbot.answeringservice.service;

import java.util.List;
import java.util.stream.Collectors;

import com.qbot.answeringservice.dto.CourseDto;
import com.qbot.answeringservice.dto.CourseList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.repository.CourseRepository;

@Service
public class CourseService {

    private static Logger logger = LoggerFactory.getLogger(CourseService.class);

    @Autowired
    private CourseRepository courseRepo;

    public void createCourse(Course course) {
        try {
            courseRepo.save(course);
        } catch (Exception exception) {
            logger.error("Error creating course. Details: " + exception.getMessage());
        }
    }

    public List<Course> findAllCourses() {
        logger.info("Fetching all courses from Mongo");
        return courseRepo.findAll();
    }

    public CourseList getAllCourses() {
        logger.info("Retrieving course list");
        return new CourseList(findAllCourses().stream().map(CourseDto::from).collect(Collectors.toList()));
    }

    public List<Course> findByCourseIds(String[] courseIds) {
        return courseRepo.findCoursesByIds(courseIds);
    }

    public CourseList getSpecificCourses(String[] courseIds) {
        return new CourseList(findByCourseIds(courseIds).stream().map(CourseDto::from).collect(Collectors.toList()));
    }

    public Course updateCourse(Course course) {
        return courseRepo.save(course);
    }

    public void deleteCourse(String courseId) {
        if (courseId != null) {
            courseRepo.deleteById(courseId);
        }
    }

}
