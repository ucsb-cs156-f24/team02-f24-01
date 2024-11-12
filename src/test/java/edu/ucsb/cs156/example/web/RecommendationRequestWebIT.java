package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_recommendation_request() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Requests").click();

        // create tests
        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("req@test.com");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("prof@test.com");
        page.getByTestId("RecommendationRequestForm-explanation").fill("test");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2024-03-02T12:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2024-03-03T12:00");
        page.getByTestId("RecommendationRequestForm-done").click();
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("req@test.com");

        // edit tests
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Recommendation Request")).isVisible();
        page.getByTestId("RecommendationRequestForm-explanation").fill("Seems like a cool chap!");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).hasText("Seems like a cool chap!");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendation_request() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Requests").click();

        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}