package com.qbot.answeringservice.service;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qbot.answeringservice.dto.ExchangeCollection;
import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.model.Exchange;
import com.qbot.answeringservice.repository.ExchangeRepository;

@Service
public class AnsweringService {

    private final Logger logger = LoggerFactory.getLogger(AnsweringService.class);
    @Autowired
    private final ExchangeRepository repository;
    @Autowired
    private final CourseService courseService;

    public AnsweringService(ExchangeRepository exchangeRepository, CourseService courseService) {
        this.repository = exchangeRepository;
        this.courseService = courseService;
    }

    public ExchangeCollection getAllExchanges() {
        long count = repository.count();
        if (count > 0) {
            List<Exchange> exchanges = repository.findAll();
            return new ExchangeCollection(null, count, exchanges);
        }
        return new ExchangeCollection(null, 0L, Collections.emptyList());
    }

    public ExchangeCollection getExchangesByCourseId(String courseId) {
        ExchangeCollection resultCollection = new ExchangeCollection(null, 0, null);
        if (courseId != null) {
            List<Exchange> resultExchanges = repository.findExchangesByCourseId(courseId);
            resultCollection.setCourseId(courseId);
            resultCollection.setExchanges(resultExchanges);
            resultCollection.setNumOfExchanges(resultExchanges.size());
        } else {
            resultCollection.setExchanges(Collections.emptyList());
        }
        return resultCollection;
    }

    @Deprecated
    public boolean overwriteAllExchanges(ExchangeCollection exchanges) {
        if (exchanges.getNumOfExchanges() == 0) {
            return true;
        }
        try {
            repository.deleteAll();
            repository.saveAll(exchanges.getExchanges());
        } catch (Exception e) {
            logger.error("Error storing exchanges: {}", e.getMessage());
            return false;
        }
        return true;
    }

    public boolean saveExchanges(ExchangeCollection exchanges) {
        if (exchanges.getNumOfExchanges() == 0) {
            return true;
        }
        try {
            String courseId = exchanges.getCourseId();
            if (courseId != null) {
                List<Course> courseResults = courseService.findByCourseIds(new String[] { courseId });
                if (courseResults != null && !courseResults.isEmpty()) {
                    // Because we don't allow educators to update or remove individual exchanges,
                    // delete all existing exchanges for course before uploading new ones
                    List<Exchange> existingExchanges = repository.findExchangesByCourseId(courseId);
                    if (!existingExchanges.isEmpty()) {
                        repository.deleteAll(existingExchanges);
                    }

                    // set foreign keys of new exchanges to match course
                    this.associateExchangesWithCourse(exchanges, courseId);
                    repository.saveAll(exchanges.getExchanges());
                } else {
                    logger.warn("No course found with ID: {}", courseId);
                    return false;
                }
            } else {
                logger.info("Cannot save exchanges without an associated course ID");
                return false;
            }
        } catch (Exception e) {
            logger.error("Error storing exchanges: {}", e.getMessage());
            return false;
        }
        return true;
    }

    private void associateExchangesWithCourse(ExchangeCollection exchanges, String courseId) {
        exchanges.getExchanges().replaceAll((Exchange exchange) -> {
            exchange.setCourseId(courseId);
            return exchange;
        });
    }
}
