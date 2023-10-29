package com.qbot.answeringservice.controller;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.qbot.answeringservice.dto.ExchangeCollection;
import com.qbot.answeringservice.model.Exchange;
import com.qbot.answeringservice.service.AnsweringService;

@ExtendWith(MockitoExtension.class)
public class AnsweringControllerTest {
    @Mock
    AnsweringService answeringService;
    @InjectMocks
    AnsweringController answeringController;

    @Test
    public void testGetAllExchanges() {
        Mockito.when(answeringService.getAllExchanges()).thenReturn(getTestExchangeCollection());
        ResponseEntity<ExchangeCollection> response = answeringController.getAllExchanges();
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    public void testGetByCourseId() {
        Mockito.when(answeringService.getExchangesByCourseId(ArgumentMatchers.anyString()))
                .thenReturn(getTestExchangeCollection());
        ResponseEntity<ExchangeCollection> response = answeringController.getByCourseId("test-course-id");
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    public void testGetByCourseIdNullId() {
        ResponseEntity<ExchangeCollection> response = answeringController.getByCourseId(null);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is4xxClientError());
    }

    @Test
    public void testUploadAllExchanges() {
        ExchangeCollection testCollection = getTestExchangeCollection();
        Mockito.when(answeringService.overwriteAllExchanges(ArgumentMatchers.any(ExchangeCollection.class)))
                .thenReturn(true);

        ResponseEntity<Void> response = answeringController.uploadAllExchanges(testCollection);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    public void testUploadAllExchangesNullPayload() {
        ResponseEntity<Void> response = answeringController.uploadAllExchanges(null);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is4xxClientError());
    }

    @Test
    public void testUploadAllExchangesFailed() {
        ExchangeCollection testCollection = getTestExchangeCollection();
        Mockito.when(answeringService.overwriteAllExchanges(ArgumentMatchers.any(ExchangeCollection.class)))
                .thenReturn(false);

        ResponseEntity<Void> response = answeringController.uploadAllExchanges(testCollection);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is4xxClientError());
    }

    @Test
    public void testUploadExchangesByCourse() {
        ExchangeCollection testCollection = getTestExchangeCollection();
        Mockito.when(answeringService.saveExchanges(testCollection)).thenReturn(true);

        ResponseEntity<Void> response = answeringController.uploadExchangesByCourse("test-course-id", testCollection);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    public void testUploadExchangesByCourseNullPayload() {
        ResponseEntity<Void> response = answeringController.uploadExchangesByCourse("", null);
        Assertions.assertNotNull(response);
        Assertions.assertTrue(response.getStatusCode().is4xxClientError());
    }

    private ExchangeCollection getTestExchangeCollection() {
        List<Exchange> testExchanges = new ArrayList<>();
        testExchanges.add(new Exchange("1", null, "testQuestion", "testAnswer"));
        return new ExchangeCollection("", testExchanges.size(), testExchanges);
    }
}
