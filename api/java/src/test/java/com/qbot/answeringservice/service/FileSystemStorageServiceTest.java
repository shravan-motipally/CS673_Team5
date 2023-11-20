package com.qbot.answeringservice.service;

import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FileSystemStorageServiceTest {

    @Test
    public void embeddingTest() {
        List<TextSegment> segments = new ArrayList<>();
        TextSegment segment = new TextSegment("test", Metadata.from("test", "test"));
        EmbeddingModel allMiniLm = new AllMiniLmL6V2EmbeddingModel();
        segments.add(segment);
        System.out.println(allMiniLm.embedAll(segments).content());
    }
}