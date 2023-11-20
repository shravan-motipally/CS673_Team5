package com.qbot.answeringservice.repository;

import com.qbot.answeringservice.model.DocumentMetadata;

import org.mongojack.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DocumentMetadataRepository extends MongoRepository<DocumentMetadata, String> {

    @ObjectId
    @Query("{ _id : { $in : ?0 }}")
    List<DocumentMetadata> findDocumentMetadataByIds(List<String> ids);

    @ObjectId
    @Query("{ _id: '?0' }")
    DocumentMetadata findDocumentMetadataById(String id);

    @Query("{ courseId: '?0' }")
    List<DocumentMetadata> findDocumentMetadataByCourseId(String courseId);

    @Query("{ courseId: '?0', name: '?1' }")
    List<DocumentMetadata> findDocumentMetadataByCourseIdAndName(String courseId, String fileName);
}
