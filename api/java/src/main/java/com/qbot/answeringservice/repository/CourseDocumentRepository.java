package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.CourseDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseDocumentRepository extends MongoRepository<CourseDocument, String> {

    @Query("{ courseId: '?0', name: '?1' }")
    List<CourseDocument> findCourseDocumentByCourseIdAndName(String courseId, String fileName);

    @Query("{ courseId: '?0', name : { $in : ?0 } }")
    List<CourseDocument> findCourseDocumentByCourseIdAndNames(String courseId, List<String> fileName);
}
