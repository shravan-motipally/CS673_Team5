package com.qbot.answeringservice.controller;

import com.qbot.answeringservice.dto.ExchangeCollection;
import com.qbot.answeringservice.service.AnsweringService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/exchanges")
public class AnsweringController {
    private final Logger logger = LoggerFactory.getLogger(AnsweringController.class);

    @Autowired
    private final AnsweringService answeringService;

    public AnsweringController(AnsweringService answeringService) {
        this.answeringService = answeringService;
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @GetMapping("/all")
    public ResponseEntity<ExchangeCollection> getAllExchanges() {
        try {
            // TODO: introduce auth
            // if (verified)
            // {
            return ResponseEntity.ok(answeringService.getAllExchanges());
            // }
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            logger.error("Server error: message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @GetMapping(path = "/{courseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ExchangeCollection> getByCourseId(@PathVariable("courseId") String courseId) {
        try {
            if (courseId != null) {
                return ResponseEntity.ok(answeringService.getExchangesByCourseId(courseId));
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error("Server error: message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @CrossOrigin(origins = { "http://localhost:3000", "https://qbot-slak.onrender.com" })
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveQuestionAndAnswerExchanges(@RequestBody ExchangeCollection exchanges) {
        try {
            // TODO: introduce auth
            // if (verified)
            // {
            if (answeringService.saveExchanges(exchanges)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
            // }
            // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            logger.error("Server error: message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
