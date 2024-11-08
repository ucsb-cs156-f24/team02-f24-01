import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBArticlesForm from "main/components/UCSBArticles/UCSBArticlesForm";
import { ucsbArticlesFixtures } from "fixtures/ucsbArticlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBArticlesForm />
      </Router>,
    );
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a UCSBArticles", async () => {
    render(
      <Router>
        <UCSBArticlesForm initialContents={ucsbArticlesFixtures.oneArticle} />
      </Router>,
    );
    await screen.findByTestId(/UCSBArticlesForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBArticlesForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <UCSBArticlesForm />
      </Router>,
    );

    const titleField = screen.getByTestId("UCSBArticlesForm-title");
    const urlField = screen.getByTestId("UCSBArticlesForm-url");
    const explanationField = screen.getByTestId("UCSBArticlesForm-explanation");
    const emailField = screen.getByTestId("UCSBArticlesForm-email");
    const dateAddedField = screen.getByTestId("UCSBArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("UCSBArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "bad-input" } });
    fireEvent.change(urlField, { target: { value: "bad-input" } });
    fireEvent.change(explanationField, { target: { value: "bad-input" } });
    fireEvent.change(emailField, { target: { value: "bad-input" } });
    fireEvent.change(dateAddedField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBArticlesForm />
      </Router>,
    );
    await screen.findByTestId("UCSBArticlesForm-submit");
    const submitButton = screen.getByTestId("UCSBArticlesForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Title is required/i);
    await screen.findByText(/Url is required/i);
    await screen.findByText(/Explanation is required/i);
    await screen.findByText(/Email is required/i);
    await screen.findByText(/dateAdded is required/i);
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );

    const titleField = screen.getByTestId("UCSBArticlesForm-title");
    const urlField = screen.getByTestId("UCSBArticlesForm-url");
    const explanationField = screen.getByTestId("UCSBArticlesForm-explanation");
    const emailField = screen.getByTestId("UCSBArticlesForm-email");
    const dateAddedField = screen.getByTestId("UCSBArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("UCSBArticlesForm-submit");

    fireEvent.change(titleField, {
      target: { value: "Vegetables Are Better Than Fruits" },
    });
    fireEvent.change(urlField, { target: { value: "onion.com" } });
    fireEvent.change(explanationField, {
      target: { value: "Nutritional values about different foods" },
    });
    fireEvent.change(emailField, { target: { value: "raymondchen@ucsb.edu" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2022-01-02T12:00:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/dateAdded must be in ISO format/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBArticlesForm />
      </Router>,
    );
    await screen.findByTestId("UCSBArticlesForm-cancel");
    const cancelButton = screen.getByTestId("UCSBArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
