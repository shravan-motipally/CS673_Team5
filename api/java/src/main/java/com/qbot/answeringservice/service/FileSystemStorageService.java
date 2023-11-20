package com.qbot.answeringservice.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import com.qbot.answeringservice.config.StorageProperties;
import com.qbot.answeringservice.exception.StorageException;
import com.qbot.answeringservice.exception.StorageFileNotFoundException;
import com.qbot.answeringservice.model.CourseDocument;
import com.qbot.answeringservice.repository.CourseDocumentRepository;
import com.qbot.answeringservice.repository.DocumentMetadataRepository;
import dev.langchain4j.data.document.*;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

import dev.langchain4j.model.output.Response;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import static dev.langchain4j.data.document.FileSystemDocumentLoader.loadDocument;
import static java.lang.String.format;

@Service
public class FileSystemStorageService implements StorageService {

    @Value("${api.key}")
    private String apiKey;

    private final Logger logger = LoggerFactory.getLogger(FileSystemStorageService.class);
    private final Path rootLocation;
    private final CourseDocumentRepository courseDocumentRepository;
    private final DocumentMetadataService documentMetadataService;
    private final CourseService courseService;

    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public FileSystemStorageService(StorageProperties properties, CourseDocumentRepository courseDocumentRepository,
                                    DocumentMetadataService documentMetadataService, CourseService courseService,
                                    SequenceGeneratorService sequenceGeneratorService) {
        this.documentMetadataService = documentMetadataService;
        this.courseService = courseService;
        this.sequenceGeneratorService = sequenceGeneratorService;

        if(properties.getLocation().trim().length() == 0){
            throw new StorageException("File upload location can not be Empty.");
        }

        this.rootLocation = Paths.get(properties.getLocation());
        this.courseDocumentRepository = courseDocumentRepository;
    }

    @Override
    @Transactional
    public void store(MultipartFile file, String courseId) throws Exception {
        if (file.isEmpty()) {
            throw new StorageException("Failed to store empty file.");
        }
        documentMetadataService.prepareReplacementDocumentForCourseId(courseId, file.getOriginalFilename());
        logger.info("Ingesting file..");
        Path destinationFile = this.rootLocation.resolve(
                        Paths.get(file.getOriginalFilename()))
                .normalize().toAbsolutePath();
        try {
            logger.info(format("Saving file under: %s", destinationFile.getFileName()));

            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException(
                        "Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }

            if (!courseService.isValidCourseId(courseId)) {
                throw new Exception("Invalid course presented for adding file");
            }

            File convFile = new File(file.getOriginalFilename());
            String pdfText = getPdfText(convFile);
            ingestText(pdfText, courseId, file.getOriginalFilename());

            logger.info(format("Ingestion of file %s successful.", file.getOriginalFilename()));

            Files.delete(destinationFile);
            documentMetadataService.addDocumentForCourse(courseId, file.getOriginalFilename());
            logger.info("Deletion of temporary file successful.");
        } catch (IOException ioe) {
            logger.error("Issue with getting file text");
            throw new Exception("Unable to convert text from pdf file");
        } finally {
            if (Files.exists(destinationFile)) {
                Files.delete(destinationFile);
            }
        }
    }

    @Transactional
    public void ingestText(String pdfText, String courseId, String fileName) throws IOException {
        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.withApiKey(apiKey);
        DocumentSplitter documentSplitter = DocumentSplitters.recursive(1000, 150);
        Document doc = Document.from(pdfText, Metadata.from("document-type", DocumentType.TXT));
        List<TextSegment> segments = documentSplitter.split(doc);
        Response<List<Embedding>> embeddings = embeddingModel.embedAll(segments);

        List<CourseDocument> documents = new ArrayList<>();

        if (embeddings.content() != null && !embeddings.content().isEmpty() && embeddings.content().size() == segments.size()) {
            for (int i = 0; i < segments.size(); i++) {
                Long id = sequenceGeneratorService.generateSequence(CourseDocument.DOCUMENT_SEQUENCE);
                CourseDocument courseDoc = new CourseDocument(id, fileName, segments.get(i).text(), embeddings.content().get(i).vector(), courseId, i+1);
                documents.add(courseDoc);
            }
        }
        courseDocumentRepository.saveAll(documents);
    }

    private String getPdfText(File file) throws IOException {
        PDDocument document = PDDocument.load(file);

        //Instantiate PDFTextStripper class
        PDFTextStripper pdfStripper = new PDFTextStripper();

        //Retrieving text from PDF document
        String text = pdfStripper.getText(document);

        document.close();
        return text;
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        }
        catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }

    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new StorageFileNotFoundException(
                        "Could not read file: " + filename);

            }
        }
        catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        }
        catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}