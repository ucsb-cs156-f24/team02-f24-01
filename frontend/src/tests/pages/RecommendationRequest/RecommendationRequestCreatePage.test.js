import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
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
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 17,
      requesterEmail: "testRequester@test.com",
      professorEmail: "testProfessor@test.com",
      explanation: "test-explanation",
      dateRequested: "2024-04-15T12:00:00",
      dateNeeded: "2024-04-16T12:00:00",
      done: false,
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

    const prefixId = "RecommendationRequestForm";
    const requesterEmailField = screen.getByTestId(
      `${prefixId}-requesterEmail`,
    );
    const professorEmailField = screen.getByTestId(
      `${prefixId}-professorEmail`,
    );
    const explanationField = screen.getByTestId(`${prefixId}-explanation`);
    const dateRequestedField = screen.getByTestId(`${prefixId}-dateRequested`);
    const dateNeededField = screen.getByTestId(`${prefixId}-dateNeeded`);
    const doneField = screen.getByTestId(`${prefixId}-done`);
    const submitButton = screen.getByTestId(`${prefixId}-submit`);

    fireEvent.change(requesterEmailField, {
      target: { value: "requester@test.com" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "professor@test.com" },
    });
    fireEvent.change(explanationField, {
      target: { value: "test-explanation-extended" },
    });
    fireEvent.change(dateRequestedField, {
      target: { value: "2022-02-02T00:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2022-02-03T00:00" },
    });
    fireEvent.click(doneField);

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "requester@test.com",
      professorEmail: "professor@test.com",
      explanation: "test-explanation-extended",
      dateRequested: "2022-02-02T00:00",
      dateNeeded: "2022-02-03T00:00",
      done: true,
    });

    expect(mockToast).toBeCalledWith(
      "New Recommendation Request Created - id: 17",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
