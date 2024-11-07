const recommendationRequestFixtures = {
  oneRequest: {
    id: 0,
    requesterEmail: "test-requester-0@gmail.com",
    professorEmail: "test-professor-0@gmail.com",
    explanation: "test-explanation-0",
    dateRequested: "2024-01-02T12:00:00",
    dateNeeded: "2024-01-02T12:00:00",
    done: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "test-requester-1@gmail.com",
      professorEmail: "test-professor-1@gmail.com",
      explanation: "test-explanation-1",
      dateRequested: "2024-03-02T12:00:00",
      dateNeeded: "2024-04-02T12:00:00",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "test-requester-2@gmail.com",
      professorEmail: "test-professor-2@gmail.com",
      explanation: "test-explanation-2",
      dateRequested: "2024-05-02T12:00:00",
      dateNeeded: "2024-06-02T12:00:00",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "test-requester-3@gmail.com",
      professorEmail: "test-professor-3@gmail.com",
      explanation: "test-explanation-3",
      dateRequested: "2024-07-02T12:00:00",
      dateNeeded: "2024-08-02T12:00:00",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
