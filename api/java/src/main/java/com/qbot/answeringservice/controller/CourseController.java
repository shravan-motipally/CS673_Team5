package com.qbot.answeringservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.service.CourseService;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    CourseService courseService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Course>> getCoursesByIds(@RequestParam("courseIds") String[] courseIds) {
        try {
            logger.debug(courseIds.toString());
            return ResponseEntity.ok(courseService.findByCourseIds(courseIds));
        } catch (Exception e) {
            logger.error("Server error: message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
