import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequestFrom-requesterEmail"),
      ).not.toBeInTheDocument();
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "request@test.com",
          professorEmail: "professor@test.com",
          explanation: "test explanation",
          dateRequested: "2024-03-14T15:00",
          dateNeeded: "2024-03-15T15:00",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: "17",
        requesterEmail: "request1@test.com",
        professorEmail: "professor1@test.com",
        explanation: "test explanation1",
        dateRequested: "2024-04-14T15:00",
        dateNeeded: "2024-04-15T15:00",
        done: false,
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const prefixId = "RecommendationRequestForm";
      await screen.findByTestId(`${prefixId}-requesterEmail`);

      const idField = screen.getByTestId(`${prefixId}-id`);
      const requesterEmailField = screen.getByTestId(
        `${prefixId}-requesterEmail`,
      );
      const professorEmailField = screen.getByTestId(
        `${prefixId}-professorEmail`,
      );
      const explanationField = screen.getByTestId(`${prefixId}-explanation`);
      const dateRequestedField = screen.getByTestId(
        `${prefixId}-dateRequested`,
      );
      const dateNeededField = screen.getByTestId(`${prefixId}-dateNeeded`);
      const submitButton = screen.getByTestId(`${prefixId}-submit`);

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("request@test.com");
      expect(professorEmailField).toHaveValue("professor@test.com");
      expect(explanationField).toHaveValue("test explanation");
      expect(dateRequestedField).toHaveValue("2024-03-14T15:00");
      expect(dateNeededField).toHaveValue("2024-03-15T15:00");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const prefixId = "RecommendationRequestForm";
      await screen.findByTestId(`${prefixId}-requesterEmail`);

      const idField = screen.getByTestId(`${prefixId}-id`);
      const requesterEmailField = screen.getByTestId(
        `${prefixId}-requesterEmail`,
      );
      const professorEmailField = screen.getByTestId(
        `${prefixId}-professorEmail`,
      );
      const explanationField = screen.getByTestId(`${prefixId}-explanation`);
      const dateRequestedField = screen.getByTestId(
        `${prefixId}-dateRequested`,
      );
      const dateNeededField = screen.getByTestId(`${prefixId}-dateNeeded`);
      const doneField = screen.getByTestId(`${prefixId}-done`);
      const submitButton = screen.getByTestId(`${prefixId}-submit`);

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("request@test.com");
      expect(professorEmailField).toHaveValue("professor@test.com");
      expect(explanationField).toHaveValue("test explanation");
      expect(dateRequestedField).toHaveValue("2024-03-14T15:00");
      expect(dateNeededField).toHaveValue("2024-03-15T15:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "request2@test.com" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "professor2@test.com" },
      });
      fireEvent.change(explanationField, {
        target: { value: "test explanation2" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2025-04-14T15:00" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2025-04-15T15:00" },
      });
      fireEvent.click(doneField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Recommendation Request Updated - id: 17",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "request2@test.com",
          professorEmail: "professor2@test.com",
          explanation: "test explanation2",
          dateRequested: "2025-04-14T15:00",
          dateNeeded: "2025-04-15T15:00",
          done: true,
        }),
      ); // posted object
    });
  });
});
