const helpRequestFixtures = {
  oneHelpRequest: [
    {
      requesterEmail: "student@example.com",
      teamId: "team01",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2023-10-01T10:00:00",
      explanation: "Need help with project setup",
      solved: false,
    }
  ],
  threeHelpRequests: [
    {
      requesterEmail: "student1@example.com",
      teamId: "team01",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2023-10-01T10:00:00",
      explanation: "Need help with project setup",
      solved: false,
    },
    {
      requesterEmail: "student2@example.com",
      teamId: "team02",
      tableOrBreakoutRoom: "Table 2",
      requestTime: "2023-10-02T11:00:00",
      explanation: "Issue with database connection",
      solved: true,
    },
    {
      requesterEmail: "student3@example.com",
      teamId: "team03",
      tableOrBreakoutRoom: "Breakout Room 1",
      requestTime: "2023-10-03T12:00:00",
      explanation: "Debugging help needed",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };