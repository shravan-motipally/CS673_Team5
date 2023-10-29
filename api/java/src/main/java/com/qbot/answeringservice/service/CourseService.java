package com.qbot.answeringservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepo;

    public Course createCourse(Course course) {
        return courseRepo.save(course);
    }

    public List<Course> findAllCourses() {
        return courseRepo.findAll();
    }

    public List<Course> findByCourseIds(String[] courseIds) {
        return courseRepo.findCoursesByIds(courseIds);
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
