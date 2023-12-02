package com.qbot.answeringservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.qbot.answeringservice.dto.BulkCourseRequest;
import com.qbot.answeringservice.dto.CourseDto;
import com.qbot.answeringservice.dto.CourseResponseCollection;
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
            String validationResults = validateCourse(course);
            if (validationResults == null || validationResults.length() == 0) {
                courseRepo.save(course);
            }
        } catch (Exception exception) {
            logger.error("Error creating course. Details: " + exception.getMessage());
        }
    }

    public List<Course> findAllCourses() {
        logger.info("Fetching all courses from Mongo");
        return courseRepo.findAll();
    }

    public CourseResponseCollection getAllCourses() {
        logger.info("Retrieving course list");
        return new CourseResponseCollection(findAllCourses().stream().map(CourseDto::from).collect(Collectors.toList()),
                null);
    }

    public List<Course> findByCourseIds(String[] courseIds) {
        return courseRepo.findCoursesByIds(courseIds);
    }

    public boolean isValidCourseId(String courseId) {
        return courseRepo.existsById(courseId);
    }

    public CourseResponseCollection getSpecificCourses(String[] courseIds) {
        return new CourseResponseCollection(
                findByCourseIds(courseIds).stream().map(CourseDto::from).collect(Collectors.toList()), null);
    }

    public Course updateCourse(Course course) {
        return courseRepo.save(course);
    }

    public void deleteCourse(String courseId) {
        if (courseId != null) {
            courseRepo.deleteById(courseId);
        }
    }

    public CourseResponseCollection bulkProcessCourses(BulkCourseRequest courseRequest) {
        List<Course> processedCourses = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        try {
            for (Course course : courseRequest.getCourses()) {
                String validationResults = validateCourse(course);
                if (validationResults == null || validationResults.length() == 0) {
                    Course processedCourse = courseRepo.save(course);
                    if (processedCourse != null) {
                        processedCourses.add(processedCourse);
                    }
                } else {
                    errors.add(validationResults);
                }
            }
        } catch (Exception e) {
            String errorString = String.format("Error storing courseList: %s", e.getMessage());
            logger.error(errorString);
            errors.add(errorString);
        }
        return new CourseResponseCollection(convertToCourseResponses(processedCourses), errors);
    }

    private String validateCourse(Course course) {
        StringBuilder builder = new StringBuilder();
        if (course.getId() != null) {
            String courseId = course.getId();
            if (!courseId.isBlank() && !courseRepo.existsById(courseId)) {
                builder.append("Provided Course ID not found\n");
            }
        }
        if (course.getSchoolId() == null || course.getSchoolId().isBlank()) {
            builder.append("School ID is invalid/missing\n");
        }
        if (course.getDepartmentId() == null || course.getDepartmentId().isBlank()) {
            builder.append("Department ID is invalid/missing\n");
        }
        if (course.getCatalogId() == null || course.getCatalogId().isBlank()) {
            builder.append("Catalog ID is invalid/missing\n");
        }
        if (course.getName() == null || course.getName().isBlank()) {
            builder.append("Name is invalid/missing\n");
        }
        if (course.getDescription() == null || course.getDescription().isBlank()) {
            builder.append("Description is invalid/missing\n");
        }
        if (course.getSemester() == null || course.getSemester().isBlank()) {
            builder.append("Semester is invalid/missing\n");
        }

        return builder.toString();
    }

    private List<CourseDto> convertToCourseResponses(List<Course> courses) {
        return courses.stream().map(CourseDto::from).collect(Collectors.toList());
    }
}
