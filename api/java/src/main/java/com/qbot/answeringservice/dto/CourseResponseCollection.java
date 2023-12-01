package com.qbot.answeringservice.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class CourseResponseCollection {
    private final List<CourseDto> courses;
    private final List<String> errors;

    public CourseResponseCollection(List<CourseDto> courses, List<String> errors) {
        this.courses = courses;
        this.errors = errors;
    }
}
