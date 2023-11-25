package com.qbot.answeringservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.lang.Nullable;
import com.qbot.answeringservice.dto.BulkUploadCourseRequest;
import com.qbot.answeringservice.dto.CourseList;
import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.service.CourseService;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    CourseService courseService;

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createCourse(@RequestBody Course course) {
        try {
            courseService.createCourse(course);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CourseList> getCourses(@RequestParam("courseIds") @Nullable String[] courseIds) {
        try {
            CourseList returnedCourses;
            returnedCourses = (courseIds != null) ? courseService.getSpecificCourses(courseIds)
                    : courseService.getAllCourses();
            return ResponseEntity.ok(returnedCourses);
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> returnedCourses;
            returnedCourses = courseService.findAllCourses();
            return ResponseEntity.ok(returnedCourses);
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Course> updateCourse(@RequestBody Course course) {
        try {
            return ResponseEntity.ok(courseService.updateCourse(course));
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @PostMapping(path = "/all", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateAllCourses(@RequestBody BulkUploadCourseRequest courseList) {
        try {
            // TODO: introduce auth
            // if (verified)
            // {
            if (courseList != null && courseService.overwriteAllCourses(courseList)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
            // }
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @DeleteMapping(path = "/{courseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Course> deleteCourse(@PathVariable("courseId") String courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            logger.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
