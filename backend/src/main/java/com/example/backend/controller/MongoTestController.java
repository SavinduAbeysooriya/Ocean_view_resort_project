package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MongoTestController {

    @GetMapping("/api/mongo-test")
    public String test() {
        return "MongoDB connected successfully 🚀";
    }
}
