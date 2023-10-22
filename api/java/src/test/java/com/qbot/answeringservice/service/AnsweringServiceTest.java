package com.qbot.answeringservice.service;

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

import com.qbot.answeringservice.dto.ExchangeCollection;
import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.model.Exchange;
import com.qbot.answeringservice.repository.ExchangeRepository;

@ExtendWith(MockitoExtension.class)
public class AnsweringServiceTest {

    @Mock
    ExchangeRepository exchangeRepo;

    @Mock
    CourseService courseService;

    @InjectMocks
    AnsweringService answeringService;

    @Test
    public void testGetAllExchanges() {
        List<Exchange> testExchanges = getTestExchanges();
        Mockito.when(exchangeRepo.count()).thenReturn(1L);
        Mockito.when(exchangeRepo.findAll()).thenReturn(testExchanges);

        ExchangeCollection returnedExchanges = answeringService.getAllExchanges();
        Assertions.assertNotNull(returnedExchanges);
        Assertions.assertEquals(testExchanges.size(), returnedExchanges.getExchanges().size());
    }

    @Test
    public void testGetAllExchangesEmptyResult() {
        Mockito.when(exchangeRepo.count()).thenReturn(0L);

        ExchangeCollection returnedExchanges = answeringService.getAllExchanges();
        Assertions.assertNotNull(returnedExchanges);
        Assertions.assertTrue(returnedExchanges.getExchanges().isEmpty());
        Mockito.verify(exchangeRepo, Mockito.times(0)).findAll();
    }

    @Test
    public void testSaveExchanges() {
        List<Exchange> testExchanges = getTestExchanges();
        ExchangeCollection testCollection = new ExchangeCollection("test-course-id", testExchanges.size(),
                testExchanges);

        Mockito.when(courseService.findByCourseIds(ArgumentMatchers.any())).thenReturn(getTestCourses());

        Assertions.assertTrue(answeringService.saveExchanges(testCollection));
        for (Exchange exchange : testCollection.getExchanges()) {
            Assertions.assertEquals(testCollection.getCourseId(), exchange.getCourseId());
        }
    }

    @Test
    public void testSaveExchangesNoPayload() {
        ExchangeCollection testCollection = new ExchangeCollection("test-course-id", 0, null);
        Assertions.assertTrue(answeringService.saveExchanges(testCollection));
        Mockito.verify(exchangeRepo, Mockito.times(0)).saveAll(ArgumentMatchers.anyList());
    }

    @Test
    public void testSaveExchangesNoCourseId() {
        List<Exchange> testExchanges = getTestExchanges();
        ExchangeCollection testCollection = new ExchangeCollection(null, testExchanges.size(), testExchanges);
        Assertions.assertFalse(answeringService.saveExchanges(testCollection));
        Mockito.verify(exchangeRepo, Mockito.times(0)).saveAll(ArgumentMatchers.anyList());
    }

    @Test
    public void testSaveExchangesCourseNotFound() {
        List<Exchange> testExchanges = getTestExchanges();
        ExchangeCollection testCollection = new ExchangeCollection("test-course-id", testExchanges.size(),
                testExchanges);
        Mockito.when(courseService.findByCourseIds(ArgumentMatchers.any())).thenReturn(new ArrayList<>());

        Assertions.assertFalse(answeringService.saveExchanges(testCollection));
        Mockito.verify(exchangeRepo, Mockito.times(0)).saveAll(ArgumentMatchers.anyList());
    }

    private List<Exchange> getTestExchanges() {
        List<Exchange> testExchanges = new ArrayList<>();
        testExchanges.add(new Exchange("1", null, "testQuestion", "testAnswer"));
        return testExchanges;
    }

    private List<Course> getTestCourses() {
        List<Course> testCourses = new ArrayList<>();
        testCourses.add(new Course("test-course-id", null, null, null, null, null, null));
        return testCourses;
    }

}
