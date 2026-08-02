package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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
    public JobApplication createApplication(@Valid @RequestBody JobApplication application) {
        return service.createApplication(application);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
    }

    @PutMapping("/{id}")
    public JobApplication updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplication application) {

        return service.updateApplication(id, application);
    }
}