import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
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
      axiosMock.onGet("/api/ucsbarticles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSBArticle");

      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
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
      axiosMock.onGet("/api/ucsbarticles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "Vegetables Are Better Than Fruits",
        url: "onion.com",
        explanation: "Nutritional values about different foods",
        email: "raymondchen@ucsb.edu",
        dateAdded: "2022-01-02T12:00",
      });
      axiosMock.onPut("/api/ucsbarticles").reply(200, {
        id: "17",
        title: "Fruits Are Better Than Veggies",
        url: "onion.com",
        explanation: "Nutritional values about different produce",
        email: "raymondchen@ucsb.edu",
        dateAdded: "2022-01-02T12:00",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      //await screen.findByTestId("UCSBArticlesForm");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      //await screen.findByTestId("UCSBArticlesForm");

      const idField = screen.getByTestId("UCSBArticlesForm-id");
      const titleField = screen.getByTestId("UCSBArticlesForm-title");
      const urlField = screen.getByTestId("UCSBArticlesForm-url");
      const explanationField = screen.getByTestId(
        "UCSBArticlesForm-explanation",
      );
      const emailField = screen.getByTestId("UCSBArticlesForm-email");
      const dateAddedField = screen.getByTestId("UCSBArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("UCSBArticlesForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("Vegetables Are Better Than Fruits");
      expect(urlField).toHaveValue("onion.com");
      expect(explanationField).toHaveValue(
        "Nutritional values about different foods",
      );
      expect(emailField).toHaveValue("raymondchen@ucsb.edu");
      expect(dateAddedField).toHaveValue("2022-01-02T12:00");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      //await screen.findByTestId("UCSBArticlesForm");

      const idField = screen.getByTestId("UCSBArticlesForm-id");
      const titleField = screen.getByTestId("UCSBArticlesForm-title");
      const urlField = screen.getByTestId("UCSBArticlesForm-url");
      const explanationField = screen.getByTestId(
        "UCSBArticlesForm-explanation",
      );
      const emailField = screen.getByTestId("UCSBArticlesForm-email");
      const dateAddedField = screen.getByTestId("UCSBArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("UCSBArticlesForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("Vegetables Are Better Than Fruits");
      expect(urlField).toHaveValue("onion.com");
      expect(explanationField).toHaveValue(
        "Nutritional values about different foods",
      );
      expect(emailField).toHaveValue("raymondchen@ucsb.edu");
      expect(dateAddedField).toHaveValue("2022-01-02T12:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, {
        target: { value: "Fruits Are Better Than Veggies" },
      });
      fireEvent.change(urlField, { target: { value: "onion.com" } });
      fireEvent.change(explanationField, {
        target: { value: "Nutritional values about different produce" },
      });
      fireEvent.change(emailField, {
        target: { value: "raymondchen@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2022-01-02T12:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBArticle Updated - id: 17 title: Fruits Are Better Than Veggies",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsbarticles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Fruits Are Better Than Veggies",
          url: "onion.com",
          explanation: "Nutritional values about different produce",
          email: "raymondchen@ucsb.edu",
          dateAdded: "2022-01-02T12:00",
        }),
      ); // posted object
    });
  });
});
