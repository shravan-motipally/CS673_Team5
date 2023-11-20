package com.qbot.answeringservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@AllArgsConstructor
public class DocumentDeletionRequest {
    private List<String> documents;
}
