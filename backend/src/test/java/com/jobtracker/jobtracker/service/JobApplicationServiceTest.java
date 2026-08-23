package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.repository.JobApplicationRepository;
import jakarta.persistence.EntityManager;

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

    @Mock
    private EntityManager entityManager;

    @Mock
    private User user;

    @InjectMocks
    private JobApplicationService service;

    @Test
    void getAllApplicationsReturnsApplicationsForUser() {
        JobApplication application = createApplication(
                "Google",
                "Software Engineer",
                "Applied"
        );

        when(repository.findByUserId(1L))
                .thenReturn(List.of(application));

        List<JobApplication> result = service.getAllApplications(1L);

        assertEquals(1, result.size());
        assertEquals("Google", result.get(0).getCompany());
        assertEquals("Software Engineer", result.get(0).getPosition());
        assertEquals("Applied", result.get(0).getStatus());

        verify(repository).findByUserId(1L);
    }

    @Test
    void getAllApplicationsReturnsEmptyListWhenUserHasNoApplications() {
        when(repository.findByUserId(1L))
                .thenReturn(List.of());

        List<JobApplication> result = service.getAllApplications(1L);

        assertTrue(result.isEmpty());

        verify(repository).findByUserId(1L);
    }

    @Test
    void createApplicationAssociatesApplicationWithUserAndSaves() {
        JobApplication application = createApplication(
                "Amazon",
                "Software Engineer",
                "Applied"
        );

        when(entityManager.getReference(User.class, 1L))
                .thenReturn(user);

        when(repository.save(application))
                .thenReturn(application);

        JobApplication result =
                service.createApplication(1L, application);

        assertSame(application, result);
        assertSame(user, application.getUser());

        verify(entityManager).getReference(User.class, 1L);
        verify(repository).save(application);
    }

    @Test
    void deleteApplicationDeletesApplicationBelongingToUser() {
        when(repository.deleteByIdAndUserId(1L, 1L))
                .thenReturn(1);

        assertDoesNotThrow(() ->
                service.deleteApplication(1L, 1L)
        );

        verify(repository).deleteByIdAndUserId(1L, 1L);
    }

    @Test
    void deleteApplicationThrowsExceptionWhenApplicationDoesNotBelongToUser() {
        when(repository.deleteByIdAndUserId(1L, 2L))
                .thenReturn(0);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.deleteApplication(2L, 1L)
        );

        assertEquals("Application not found", exception.getMessage());

        verify(repository).deleteByIdAndUserId(1L, 2L);
    }

    @Test
    void updateApplicationUpdatesApplicationBelongingToUser() {
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

        when(repository.findByIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(existingApplication));

        when(repository.save(existingApplication))
                .thenReturn(existingApplication);

        JobApplication result =
                service.updateApplication(
                        1L,
                        1L,
                        updatedApplication
                );

        assertEquals("Microsoft", result.getCompany());
        assertEquals("Backend Developer", result.getPosition());
        assertEquals("Interview", result.getStatus());

        verify(repository).findByIdAndUserId(1L, 1L);
        verify(repository).save(existingApplication);
    }

    @Test
    void updateApplicationThrowsExceptionWhenApplicationDoesNotBelongToUser() {
        JobApplication updatedApplication = createApplication(
                "Google",
                "Software Engineer",
                "Applied"
        );

        when(repository.findByIdAndUserId(1L, 2L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.updateApplication(
                        2L,
                        1L,
                        updatedApplication
                )
        );

        assertEquals("Application not found", exception.getMessage());

        verify(repository).findByIdAndUserId(1L, 2L);
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