package com.qbot.answeringservice.controller;

import com.qbot.answeringservice.dto.DocumentDeletionRequest;
import com.qbot.answeringservice.dto.DocumentList;
import com.qbot.answeringservice.exception.StorageFileNotFoundException;
import com.qbot.answeringservice.model.DocumentMetadata;
import com.qbot.answeringservice.service.DocumentMetadataService;
import com.qbot.answeringservice.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/documents")
public class DocumentController {

    private final Logger logger = LoggerFactory.getLogger(DocumentController.class);
    private final StorageService storageService;
    private final DocumentMetadataService documentMetadataService;

    @Autowired
    public DocumentController(StorageService storageService, DocumentMetadataService documentMetadataService) {
        this.storageService = storageService;
        this.documentMetadataService = documentMetadataService;
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @PostMapping
    public ResponseEntity<Void> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("courseId") String courseId) {
        try {
            storageService.store(file, courseId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @GetMapping
    public ResponseEntity<DocumentList> retrieveAllFiles(@RequestParam("courseId") String courseId) {
        try {
            List<DocumentMetadata> documents = documentMetadataService.getAllFilesForCourse(courseId);
            DocumentList list = new DocumentList(documents);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable("id") String documentId) {
        try {
            if (documentMetadataService.removeDocumentFromCourse(documentId)) {
                return ResponseEntity.ok().build();
            } else {
                logger.error("Issue removing {}", documentId);
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            logger.error("Issue removing {}", documentId);
            return ResponseEntity.internalServerError().build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @DeleteMapping
    public ResponseEntity<Void> deleteFiles(@RequestParam("name") String fileName, @RequestParam("courseId") String courseId) {
        try {
            if (documentMetadataService.removeDocumentFromCourse(courseId, fileName)) {
                return ResponseEntity.ok().build();
            } else {
                logger.error("Issue removing {}", fileName);
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            logger.error("Issue removing {}", fileName);
            return ResponseEntity.internalServerError().build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @PostMapping("/deleteAll")
    public ResponseEntity<Void> deleteFiles(@RequestBody DocumentDeletionRequest request) {
        try {
            if (documentMetadataService.removeDocumentsFromCourse(request.getDocuments())) {
                return ResponseEntity.ok().build();
            } else {
                logger.error("Issue removing files in deleteAll request");
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            logger.error("Issue removing files in deleteAll request");
            return ResponseEntity.internalServerError().build();
        }
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

}