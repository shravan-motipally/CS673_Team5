package com.qbot.answeringservice.service;

import com.qbot.answeringservice.dto.ExchangeCollection;
import com.qbot.answeringservice.model.Course;
import com.qbot.answeringservice.model.Exchange;
import com.qbot.answeringservice.repository.ExchangeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AnsweringService {

    private final Logger logger = LoggerFactory.getLogger(AnsweringService.class);
    @Autowired
    private final ExchangeRepository repository;
    @Autowired
    private final CourseService courseService;

    public AnsweringService(ExchangeRepository repository, CourseService courseService) {
        this.repository = repository;
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

    public boolean saveExchanges(ExchangeCollection exchanges) {
        if (exchanges.getNumOfQuestions() == 0) {
            return true;
        }
        try {
            String courseId = exchanges.getCourseId();
            if (courseId != null) {
                List<Course> courseResults = courseService.findByCourseIds(new String[] { courseId });
                if (courseResults != null && !courseResults.isEmpty()) {
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
            logger.error("Error storing exchanges: error message: {}", e.getMessage());
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
