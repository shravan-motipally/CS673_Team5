package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.CourseDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseDocumentRepository extends MongoRepository<CourseDocument, String> {

}
