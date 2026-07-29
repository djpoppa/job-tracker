package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<JobApplication> getApplications() {
        return service.getAllApplications();
    }

    @PostMapping
    public JobApplication createApplication(@RequestBody JobApplication application) {
        return service.createApplication(application);
    }
}