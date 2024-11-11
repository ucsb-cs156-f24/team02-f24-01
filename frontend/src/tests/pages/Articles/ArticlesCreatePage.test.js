import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const ucsbArticles = {
      id: 17,
      title: "Vegetables Are Better Than Fruits",
      url: "onion.com",
      explanation: "Nutritional values about different foods",
      email: "raymondchen@ucsb.edu",
      dateAdded: "2022-02-02T00:00",
    };

    axiosMock.onPost("/api/ucsbarticles/post").reply(202, ucsbArticles);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
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
      target: { value: "2022-02-02T00:00" },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      dateAdded: "2022-02-02T00:00",
      title: "Vegetables Are Better Than Fruits",
      url: "onion.com",
      explanation: "Nutritional values about different foods",
      email: "raymondchen@ucsb.edu",
    });

    expect(mockToast).toBeCalledWith(
      "New ucsbArticles Created - id: 17 title: Vegetables Are Better Than Fruits",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbarticles" });
  });
});
