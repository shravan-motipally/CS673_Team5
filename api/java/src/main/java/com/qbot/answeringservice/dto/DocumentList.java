package com.qbot.answeringservice.dto;

import com.qbot.answeringservice.model.DocumentMetadata;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DocumentList {
    private List<DocumentMetadata> documents;

}
