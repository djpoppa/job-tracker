package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.security.AuthenticatedUser;
import com.jobtracker.jobtracker.service.CustomUserDetailsService;
import com.jobtracker.jobtracker.service.JobApplicationService;
import com.jobtracker.jobtracker.service.JwtService;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(JobApplicationControllerTest.SecurityTestConfig.class)
class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JobApplicationService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @TestConfiguration
    static class SecurityTestConfig implements WebMvcConfigurer {

        @Bean
        AuthenticationPrincipalArgumentResolver authenticationPrincipalArgumentResolver() {
            return new AuthenticationPrincipalArgumentResolver();
        }

        @Override
        public void addArgumentResolvers(
                List<HandlerMethodArgumentResolver> resolvers) {

            resolvers.add(authenticationPrincipalArgumentResolver());
        }
    }

    private UsernamePasswordAuthenticationToken authenticatedUser() {
        return new UsernamePasswordAuthenticationToken(
                new AuthenticatedUser(1L, "user@example.com"),
                null,
                List.of()
        );
    }

    private void authenticateUser() {
        SecurityContextHolder.getContext().setAuthentication(
                authenticatedUser()
        );
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getApplicationsReturnsApplications() throws Exception {
        authenticateUser();

        JobApplication application = new JobApplication();
        application.setCompany("Google");
        application.setPosition("Software Engineer");
        application.setStatus("Applied");

        when(service.getAllApplications(1L))
                .thenReturn(List.of(application));

        mockMvc.perform(get("/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].company").value("Google"))
                .andExpect(jsonPath("$[0].position").value("Software Engineer"))
                .andExpect(jsonPath("$[0].status").value("Applied"));

        verify(service).getAllApplications(1L);
    }

    @Test
    void createApplicationReturnsCreatedApplication() throws Exception {
        authenticateUser();

        JobApplication application = new JobApplication();
        application.setCompany("Microsoft");
        application.setPosition("Backend Developer");
        application.setStatus("Applied");

        when(service.createApplication(eq(1L), any(JobApplication.class)))
                .thenReturn(application);

        mockMvc.perform(post("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "company": "Microsoft",
                                    "position": "Backend Developer",
                                    "status": "Applied"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Microsoft"))
                .andExpect(jsonPath("$.position").value("Backend Developer"))
                .andExpect(jsonPath("$.status").value("Applied"));

        verify(service).createApplication(eq(1L), any(JobApplication.class));
    }

    @Test
    void createApplicationRejectsBlankCompany() throws Exception {
        authenticateUser();

        mockMvc.perform(post("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "company": "",
                                    "position": "Backend Developer",
                                    "status": "Applied"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateApplicationReturnsUpdatedApplication() throws Exception {
        authenticateUser();

        JobApplication application = new JobApplication();
        application.setCompany("Amazon");
        application.setPosition("Software Engineer");
        application.setStatus("Interview");

        when(service.updateApplication(
                eq(1L),
                eq(1L),
                any(JobApplication.class)))
                .thenReturn(application);

        mockMvc.perform(put("/applications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "company": "Amazon",
                                    "position": "Software Engineer",
                                    "status": "Interview"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Amazon"))
                .andExpect(jsonPath("$.position").value("Software Engineer"))
                .andExpect(jsonPath("$.status").value("Interview"));

        verify(service).updateApplication(
                eq(1L),
                eq(1L),
                any(JobApplication.class)
        );
    }

    @Test
    void updateApplicationRejectsBlankCompany() throws Exception {
        authenticateUser();

        mockMvc.perform(put("/applications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "company": "",
                                    "position": "Software Engineer",
                                    "status": "Interview"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteApplicationReturnsNoContent() throws Exception {
        authenticateUser();

        mockMvc.perform(delete("/applications/1"))
                .andExpect(status().isNoContent());

        verify(service).deleteApplication(1L, 1L);
    }
}