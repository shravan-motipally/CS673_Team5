package com.qbot.answeringservice.service;

import com.qbot.answeringservice.model.CourseDocument;
import com.qbot.answeringservice.model.DocumentMetadata;
import com.qbot.answeringservice.repository.CourseDocumentRepository;
import com.qbot.answeringservice.repository.DocumentMetadataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

@Service
public class DocumentMetadataService {

    private final Logger logger = LoggerFactory.getLogger(DocumentMetadataService.class);
    private final DocumentMetadataRepository documentMetadataRepository;
    private final CourseDocumentRepository courseDocumentRepository;

    @Autowired
    public DocumentMetadataService(DocumentMetadataRepository documentMetadataRepository, CourseDocumentRepository courseDocumentRepository) {
        this.documentMetadataRepository = documentMetadataRepository;
        this.courseDocumentRepository = courseDocumentRepository;
    }

    public void addDocumentForCourse(String courseId, String fileName) {
        documentMetadataRepository.save(new DocumentMetadata(fileName, courseId));
    }

    @Transactional
    public void prepareReplacementDocumentForCourseId(String courseId, String fileName) {
        List<DocumentMetadata> documents = documentMetadataRepository.findDocumentMetadataByCourseIdAndName(courseId, fileName);
        if (!documents.isEmpty()) {
            List<CourseDocument> courseDocuments = courseDocumentRepository.findCourseDocumentByCourseIdAndName(courseId, fileName);
            documentMetadataRepository.deleteAll(documents);
            courseDocumentRepository.deleteAll(courseDocuments);
        }
    }

    public List<DocumentMetadata> getAllFilesForCourse(String courseId) {
        return documentMetadataRepository.findDocumentMetadataByCourseId(courseId);
    }

    @Transactional
    public boolean removeDocumentFromCourse(String documentId) {
        DocumentMetadata docMetadata = documentMetadataRepository.findDocumentMetadataById(documentId);
        if (docMetadata != null) {
            List<CourseDocument> courseDocuments = courseDocumentRepository
                    .findCourseDocumentByCourseIdAndName(docMetadata.getCourseId(),
                    docMetadata.getName());
            documentMetadataRepository.delete(docMetadata);
            courseDocumentRepository.deleteAll(courseDocuments);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean removeDocumentFromCourse(String courseId, String fileName) {
        List<DocumentMetadata> documents = documentMetadataRepository.findDocumentMetadataByCourseIdAndName(courseId, fileName);
        List<CourseDocument> courseDocuments = courseDocumentRepository.findCourseDocumentByCourseIdAndName(courseId, fileName);
        if (documents == null || documents.isEmpty()) {
            logger.info("No documents found to delete");
            return false;
        } else {
            documentMetadataRepository.deleteAll(documents);
            courseDocumentRepository.deleteAll(courseDocuments);
        }
        return true;
    }

    @Transactional
    public boolean removeDocumentsFromCourse(List<String> documentIds) {
        List<DocumentMetadata> documents = documentMetadataRepository.findDocumentMetadataByIds(documentIds);
        if (documents == null || documents.isEmpty()) {
            logger.info("No documents found to delete");
            return false;
        } else {
            List<CourseDocument> courseDocuments = new LinkedList<>();
            documents.forEach(doc -> {
                List<CourseDocument> docs =
                        courseDocumentRepository
                                .findCourseDocumentByCourseIdAndName(doc.getCourseId(),
                                        doc.getName());
                courseDocuments.addAll(docs);
            });
            documentMetadataRepository.deleteAll(documents);
            courseDocumentRepository.deleteAll(courseDocuments);
        }
        return true;
    }

}
