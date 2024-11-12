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
public class ArticlesWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_Articles() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create a New Article")).isVisible();
        page.getByTestId("UCSBArticlesForm-title").fill("Healthiest Campus Restaurants");
        page.getByTestId("UCSBArticlesForm-url").fill("yelp.com");
        page.getByTestId("UCSBArticlesForm-explanation").fill("The best places to go to for nutrition");
        page.getByTestId("UCSBArticlesForm-email").fill("student@test.com");
        page.getByTestId("UCSBArticlesForm-dateAdded").fill("2022-01-03T00:00");
        page.getByTestId("UCSBArticlesForm-submit").click();

        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-title"))
                .hasText("Healthiest Campus Restaurants");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-url"))
                .hasText("yelp.com");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-explanation"))
                .hasText("The best places to go to for nutrition");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-email"))
                .hasText("student@test.com");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-dateAdded"))
                .hasText("2022-01-03T00:00:00");

        page.getByTestId("UCSBArticlesTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBArticle")).isVisible();
        page.getByTestId("UCSBArticlesForm-title").fill("Healthiest Campus Restaurant");
        page.getByTestId("UCSBArticlesForm-url").fill("thebest.com");
        page.getByTestId("UCSBArticlesForm-explanation").fill("The best place to go to for nutrition");
        page.getByTestId("UCSBArticlesForm-email").fill("students@test.com");
        page.getByTestId("UCSBArticlesForm-dateAdded").fill("2023-01-03T00:00");
        page.getByTestId("UCSBArticlesForm-submit").click();

        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-title")).hasText("Healthiest Campus Restaurant");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-url")).hasText("thebest.com");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-explanation")).hasText("The best place to go to for nutrition");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-email")).hasText("students@test.com");
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-dateAdded")).hasText("2023-01-03T00:00:00");

        page.getByTestId("UCSBArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_Articles() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create a New Article")).not().isVisible();
        assertThat(page.getByTestId("UCSBArticlesTable-cell-row-0-col-name")).not().isVisible();
    }
}