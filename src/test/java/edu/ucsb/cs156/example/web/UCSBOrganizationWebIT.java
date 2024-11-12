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
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_organization() throws Exception {
        setupUser(true);

        // Create - Act
        page.getByText("UCSB Organization").click();

        page.getByText("Create UCSB Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgField").fill("SLEEP");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Sleep Club");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Sleep Club @ UCSB");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        // Create - Assert
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgField"))
            .hasText("SLEEP");
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgTranslationShort"))
            .hasText("Sleep Club");
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgTranslation"))
            .hasText("Sleep Club @ UCSB");

        // Edit - Act
        page.getByTestId("OrganizationTable-cell-row-0-col-Edit").click();
        assertThat(page.getByText("Edit UCSB Organization")).isVisible();
       
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Sleep Club 2");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("The Sleep Club 2 @ UCSB");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        // Edit - Assert
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgTranslationShort"))
            .hasText("Sleep Club 2");
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgTranslation"))
            .hasText("The Sleep Club 2 @ UCSB");

        // Delete - Act
        page.getByTestId("OrganizationTable-cell-row-0-col-Delete").click();

        // Delete - Assert
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgField")).not().isVisible();
    }
}