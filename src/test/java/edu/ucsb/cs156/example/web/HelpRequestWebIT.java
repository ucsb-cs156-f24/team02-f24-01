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
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_helpRequest() throws Exception {
        setupUser(true);
        page.setDefaultTimeout(10000);

        System.out.println(page.content());
        page.getByText("Help Request").click();
        System.out.println(page.content());

        page.getByText("Create HelpRequest").click();
        assertThat(page.getByText("Create New HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("test@ucsb.edu");
        page.getByTestId("HelpRequestForm-teamId").fill("007");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table");
        page.getByTestId("HelpRequestForm-requestTime").fill("2024-10-10T10:10");
        page.getByTestId("HelpRequestForm-explanation").fill("test");

        page.getByTestId("HelpRequestForm-submit").click();
        System.out.println(page.content());
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("test@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("test2@ucsb.edu");
        page.getByTestId("HelpRequestForm-submit").click();

        System.out.println(page.content());
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("test2@ucsb.edu");
        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }


    @Test
    public void regular_user_cannot_create_HelpRequest() throws Exception {
        setupUser(false);

        page.getByText("Help Request").click();

        assertThat(page.getByText("Create New HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
    }
}
