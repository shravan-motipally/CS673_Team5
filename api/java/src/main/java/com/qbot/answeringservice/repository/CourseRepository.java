package com.qbot.answeringservice.repository;

import java.util.List;

import org.mongojack.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.qbot.answeringservice.model.Course;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    @ObjectId
    @Query("{ _id : { $in : ?0 } }")
    List<Course> findCoursesByIds(String[] courseIds);
}
