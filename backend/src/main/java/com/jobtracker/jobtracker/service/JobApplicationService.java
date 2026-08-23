package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.repository.JobApplicationRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final EntityManager entityManager;

    public JobApplicationService(
            JobApplicationRepository repository,
            EntityManager entityManager) {

        this.repository = repository;
        this.entityManager = entityManager;
    }

    public List<JobApplication> getAllApplications(Long userId) {
        return repository.findByUserId(userId);
    }

    public JobApplication createApplication(
            Long userId,
            JobApplication application) {

        User user = entityManager.getReference(User.class, userId);
        application.setUser(user);

        return repository.save(application);
    }

    
    @Transactional
    public void deleteApplication(Long userId, Long id) {
        int deleted = repository.deleteByIdAndUserId(id, userId);

        if (deleted == 0) {
            throw new RuntimeException("Application not found");
        }
    }

    public JobApplication updateApplication(
            Long userId,
            Long id,
            JobApplication updatedApplication) {

        return repository.findByIdAndUserId(id, userId)
                .map(application -> {
                    application.setCompany(updatedApplication.getCompany());
                    application.setPosition(updatedApplication.getPosition());
                    application.setStatus(updatedApplication.getStatus());

                    return repository.save(application);
                })
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
}