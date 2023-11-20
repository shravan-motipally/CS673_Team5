package com.qbot.answeringservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.mongojack.Id;
import org.mongojack.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="document_metadata")
public class DocumentMetadata {
    @Id
    @ObjectId
    private String id;

    private String courseId;
    private String name;

    public DocumentMetadata(String name, String courseId) {
        this.courseId = courseId;
        this.name = name;
    }
}
