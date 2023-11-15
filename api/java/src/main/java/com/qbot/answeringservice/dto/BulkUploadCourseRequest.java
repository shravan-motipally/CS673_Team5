package com.qbot.answeringservice.dto;

import com.qbot.answeringservice.model.Course;
import lombok.Getter;

import java.util.List;

@Getter
public class BulkUploadCourseRequest {
    private final int numCourses;
    private final List<Course> courses;

    public BulkUploadCourseRequest(int numCourses, List<Course> courses) {
        this.numCourses = numCourses;
        this.courses = courses;
    }
}
