package com.qbot.answeringservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DocumentDeletionRequest {
    private List<String> documents;
}
