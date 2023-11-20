package com.qbot.answeringservice.service;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.embedding.EmbeddingModel;

class FileSystemStorageServiceTest {

    @Test
    public void embeddingTest() {
        List<TextSegment> segments = new ArrayList<>();
        TextSegment segment = new TextSegment("test", Metadata.from("test", "test"));
        EmbeddingModel allMiniLm = new AllMiniLmL6V2EmbeddingModel();
        segments.add(segment);
        Assertions.assertNotNull(allMiniLm.embedAll(segments).content());
    }
}