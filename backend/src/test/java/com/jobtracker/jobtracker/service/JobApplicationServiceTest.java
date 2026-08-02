package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.repository.JobApplicationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @InjectMocks
    private JobApplicationService service;

    @Test
    void getAllApplicationsReturnsApplications() {
        JobApplication application = createApplication(
                "Google",
                "Software Engineer",
                "Applied"
        );

        when(repository.findAll()).thenReturn(List.of(application));

        List<JobApplication> result = service.getAllApplications();

        assertEquals(1, result.size());
        assertEquals("Google", result.get(0).getCompany());
        assertEquals("Software Engineer", result.get(0).getPosition());
        assertEquals("Applied", result.get(0).getStatus());

        verify(repository).findAll();
    }

    @Test
    void getApplicationByIdReturnsApplication() {
        JobApplication application = createApplication(
                "Microsoft",
                "Backend Developer",
                "Applied"
        );

        when(repository.findById(1L)).thenReturn(Optional.of(application));

        Optional<JobApplication> result = service.getApplicationById(1L);

        assertTrue(result.isPresent());
        assertEquals("Microsoft", result.get().getCompany());

        verify(repository).findById(1L);
    }

    @Test
    void getApplicationByIdReturnsEmptyWhenApplicationDoesNotExist() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        Optional<JobApplication> result = service.getApplicationById(999L);

        assertTrue(result.isEmpty());

        verify(repository).findById(999L);
    }

    @Test
    void createApplicationSavesAndReturnsApplication() {
        JobApplication application = createApplication(
                "Amazon",
                "Software Engineer",
                "Applied"
        );

        when(repository.save(application)).thenReturn(application);

        JobApplication result = service.createApplication(application);

        assertSame(application, result);

        verify(repository).save(application);
    }

    @Test
    void deleteApplicationDeletesApplication() {
        service.deleteApplication(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void updateApplicationUpdatesExistingApplication() {
        JobApplication existingApplication = createApplication(
                "Google",
                "Software Engineer",
                "Applied"
        );

        JobApplication updatedApplication = createApplication(
                "Microsoft",
                "Backend Developer",
                "Interview"
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(existingApplication));

        when(repository.save(existingApplication))
                .thenReturn(existingApplication);

        JobApplication result =
                service.updateApplication(1L, updatedApplication);

        assertEquals("Microsoft", result.getCompany());
        assertEquals("Backend Developer", result.getPosition());
        assertEquals("Interview", result.getStatus());

        verify(repository).findById(1L);
        verify(repository).save(existingApplication);
    }

    @Test
    void updateApplicationThrowsExceptionWhenApplicationDoesNotExist() {
        when(repository.findById(999L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.updateApplication(
                        999L,
                        createApplication(
                                "Google",
                                "Software Engineer",
                                "Applied"
                        )
                )
        );

        assertEquals("Application not found", exception.getMessage());

        verify(repository).findById(999L);
        verify(repository, never()).save(any(JobApplication.class));
    }

    private JobApplication createApplication(
            String company,
            String position,
            String status) {

        JobApplication application = new JobApplication();

        application.setCompany(company);
        application.setPosition(position);
        application.setStatus(status);

        return application;
    }
}