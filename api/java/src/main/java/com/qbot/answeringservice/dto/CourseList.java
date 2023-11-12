package com.qbot.answeringservice.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class CourseList {
    private final List<CourseDto> courses;

    public CourseList(List<CourseDto> courses) {
        this.courses = courses;
    }
}
