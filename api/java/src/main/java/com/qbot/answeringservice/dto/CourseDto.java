package com.qbot.answeringservice.dto;

import com.qbot.answeringservice.model.Course;
import lombok.Getter;

import static java.lang.String.format;

@Getter
public class CourseDto {
    private final String courseId;
    private final String name;
    private final String shortName;
    private final String department;
    private final String description;

    public CourseDto(String courseId, String name, String shortName, String department, String description) {
        this.courseId = courseId;
        this.name = name;
        this.shortName = shortName;
        this.department = department;
        this.description = description;
    }

    public static CourseDto from(Course course) {
        return new CourseDto(course.getId(),
                format("[%s] %s %s%s - %s", course.getSemester(), course.getSchoolId(), course.getDepartmentId(),
                        course.getCatalogId(), course.getName()),
                format("%s %s%s", course.getSchoolId(), course.getDepartmentId(), course.getCatalogId()),
                course.getDepartmentId(), course.getDescription());
    }
}
