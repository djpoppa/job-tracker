package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.security.AuthenticatedUser;
import com.jobtracker.jobtracker.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public List<JobApplication> getApplications(
            @AuthenticationPrincipal AuthenticatedUser user) {

        return service.getAllApplications(user.id());
    }

    @PostMapping
    public JobApplication createApplication(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody JobApplication application) {

        return service.createApplication(user.id(), application);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable Long id) {

        service.deleteApplication(user.id(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public JobApplication updateApplication(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable Long id,
            @Valid @RequestBody JobApplication application) {

        return service.updateApplication(user.id(), id, application);
    }
}