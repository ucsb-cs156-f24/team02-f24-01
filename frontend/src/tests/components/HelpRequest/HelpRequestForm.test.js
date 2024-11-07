import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly with no initialContents", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Requester Email/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Team ID/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Table or Breakout Room/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Request Time/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Explanation/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Solved/)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Requester Email/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Team ID/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Table or Breakout Room/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Request Time/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Explanation/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Solved/)).toBeInTheDocument();

    expect(await screen.findByTestId("HelpRequestForm-id")).toBeInTheDocument();
    expect(screen.getByTestId("HelpRequestForm-id")).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );

    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(teamIdField, { target: { value: "" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "" } });
    fireEvent.change(requestTimeField, { target: { value: "bad-input" } });
    fireEvent.change(explanationField, { target: { value: "" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Team ID is required./);
    expect(screen.getByText(/Table or Breakout Room is required./)).toBeInTheDocument();
    expect(screen.getByText(/Invalid ISO date format/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );

    const submitButton = screen.getByTestId("HelpRequestForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Team ID is required./);
    expect(screen.getByText(/Table or Breakout Room is required./)).toBeInTheDocument();
    expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "student@example.com" } });
    fireEvent.change(teamIdField, { target: { value: "team01" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "Table 1" } });
    fireEvent.change(requestTimeField, { target: { value: "2023-10-01T10:00" } });
    fireEvent.change(explanationField, { target: { value: "Need help with project setup" } });
    fireEvent.click(solvedField);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Team ID is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Table or Breakout Room is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Invalid ISO date format/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );

    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});