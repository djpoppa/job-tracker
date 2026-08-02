package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.JobApplication;
import com.jobtracker.jobtracker.service.JobApplicationService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobApplicationController.class)
class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JobApplicationService service;

    @Test
    void getApplicationsReturnsApplications() throws Exception {
        JobApplication application = new JobApplication();
        application.setCompany("Google");
        application.setPosition("Software Engineer");
        application.setStatus("Applied");

        when(service.getAllApplications()).thenReturn(List.of(application));

        mockMvc.perform(get("/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].company").value("Google"))
                .andExpect(jsonPath("$[0].position").value("Software Engineer"))
                .andExpect(jsonPath("$[0].status").value("Applied"));
    }

    @Test
    void createApplicationReturnsCreatedApplication() throws Exception {
        JobApplication application = new JobApplication();
        application.setCompany("Microsoft");
        application.setPosition("Backend Developer");
        application.setStatus("Applied");

        when(service.createApplication(any(JobApplication.class)))
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
    }

    @Test
    void createApplicationRejectsBlankCompany() throws Exception {
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
        JobApplication application = new JobApplication();
        application.setCompany("Amazon");
        application.setPosition("Software Engineer");
        application.setStatus("Interview");

        when(service.updateApplication(eq(1L), any(JobApplication.class)))
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
    }

    @Test
    void updateApplicationRejectsBlankCompany() throws Exception {
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
    void deleteApplicationReturnsOk() throws Exception {
        doNothing().when(service).deleteApplication(1L);

        mockMvc.perform(delete("/applications/1"))
                .andExpect(status().isOk());
    }
}