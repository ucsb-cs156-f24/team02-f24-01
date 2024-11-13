package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestIT {

    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_user_can_post_a_new_help_request() throws Exception {
        // Arrange
        LocalDateTime requestTime = LocalDateTime.parse("2024-11-12T10:15:30");
        
        HelpRequest expectedHelpRequest = HelpRequest.builder()
                .requesterEmail("test@example.com")
                .teamId("team03")
                .tableOrBreakoutRoom("Room 101")
                .requestTime(requestTime)
                .explanation("Need help with testing.")
                .solved(false)
                .build();

        // Act
        MvcResult response = mockMvc.perform(
                post("/api/helprequest/post")
                        .param("requesterEmail", "test@example.com")
                        .param("teamId", "team03")
                        .param("tableOrBreakoutRoom", "Room 101")
                        .param("requestTime", "2024-11-12T10:15:30")
                        .param("explanation", "Need help with testing.")
                        .param("solved", "false")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        // Assert
        String expectedJson = mapper.writeValueAsString(expectedHelpRequest);
        String responseString = response.getResponse().getContentAsString();
        HelpRequest actualHelpRequest = mapper.readValue(responseString, HelpRequest.class);

        assertEquals(expectedHelpRequest.getRequesterEmail(), actualHelpRequest.getRequesterEmail());
        assertEquals(expectedHelpRequest.getTeamId(), actualHelpRequest.getTeamId());
        assertEquals(expectedHelpRequest.getTableOrBreakoutRoom(), actualHelpRequest.getTableOrBreakoutRoom());
        assertEquals(expectedHelpRequest.getRequestTime(), actualHelpRequest.getRequestTime());
        assertEquals(expectedHelpRequest.getExplanation(), actualHelpRequest.getExplanation());
        assertEquals(expectedHelpRequest.getSolved(), actualHelpRequest.getSolved());
    }
}