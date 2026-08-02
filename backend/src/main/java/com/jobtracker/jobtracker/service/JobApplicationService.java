package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    public Optional<JobApplication> getApplicationById(Long id) {
        return repository.findById(id);
    }

    public JobApplication createApplication(JobApplication application) {
        return repository.save(application);
    }

    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }

    public JobApplication updateApplication(Long id, JobApplication updatedApplication) {

        return repository.findById(id)
            .map(application -> {
                application.setCompany(updatedApplication.getCompany());
                application.setPosition(updatedApplication.getPosition());
                application.setStatus(updatedApplication.getStatus());

                return repository.save(application);
            })
            .orElseThrow(() -> new RuntimeException("Application not found"));
    }
}