package com.jobtracker.jobtracker.repository;

import com.jobtracker.jobtracker.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

}