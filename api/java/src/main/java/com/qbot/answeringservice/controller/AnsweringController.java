package com.qbot.answeringservice.controller;

import com.qbot.answeringservice.dto.AllExchanges;
import com.qbot.answeringservice.service.AnsweringService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class AnsweringController {

    private final AnsweringService answeringService;

    public AnsweringController(AnsweringService answeringService) {
        this.answeringService = answeringService;
    }

    @CrossOrigin(origins = {"http://localhost:3000", "https://qbot-slak.onrender.com"})
    @GetMapping("/all")
    public ResponseEntity<AllExchanges> getAllExchanges() {
        // TODO: introduce auth
        // if (verified)
        // {
        return ResponseEntity.ok(answeringService.getAllExchanges());
        // }
        // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @CrossOrigin(origins = {"http://localhost:3000", "https://qbot-slak.onrender.com"})
    @PostMapping("/questions")
    public ResponseEntity<Void> saveQuestionsAndAnswerExchanges(@RequestBody AllExchanges exchanges) {
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
    }
}
