import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures.js";

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
      orgField: "OSLI",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationEditPage tests", () => {
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
        .onGet("/api/ucsborganizations", { params: { orgField: "SKY" } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSB Organization");
      expect(
        screen.queryByTestId("UCSBOrganizationForm-orgField"),
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
        .onGet("/api/ucsborganizations", { params: { orgField: "OSLI" } })
        .reply(200, ucsbOrganizationFixtures.oneOrg[0]);
      axiosMock.onPut("/api/ucsborganizations").reply(200, {
        orgField: "OSLI",
        orgTranslationShort: "STUDENT L",
        orgTranslation: "OFFICE OF STUDENT L",
        inactive: "true",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgField");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgField");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForminactive");

      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toBeInTheDocument();
      expect(orgCodeField).toHaveValue("OSLI");
      expect(orgTranslationShortField).toBeInTheDocument();
      expect(orgTranslationShortField).toHaveValue("STUDENT LIFE");
      expect(orgTranslationField).toBeInTheDocument();
      expect(orgTranslationField).toHaveValue("OFFICE OF STUDENT LIFE");
      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgField");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgField");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForminactive");

      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgTranslationShortField).toHaveValue("STUDENT LIFE");
      expect(orgTranslationField).toHaveValue("OFFICE OF STUDENT LIFE");
      expect(inactiveField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(orgTranslationShortField, {
        target: { value: "STUDENT L" },
      });
      fireEvent.change(orgTranslationField, {
        target: { value: "OFFICE OF STUDENT L" },
      });
      fireEvent.change(inactiveField, {
        target: { value: "true" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "UCSB Organization Updated - orgField: OSLI orgTranslationShort: STUDENT L orgTranslation: OFFICE OF STUDENT L inactive: true",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ orgField: "OSLI" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgField: "OSLI",
          orgTranslationShort: "STUDENT L",
          orgTranslation: "OFFICE OF STUDENT L",
          inactive: false,
        }),
      ); // posted object
    });
  });
});