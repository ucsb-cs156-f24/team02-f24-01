import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbArticlesFixtures } from "fixtures/ucsbArticlesFixtures";
import { http, HttpResponse } from "msw";

import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

export default {
  title: "pages/Articles/ArticlesEditPage",
  component: ArticlesEditPage,
};

const Template = () => <ArticlesEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/ucsbarticles", () => {
      return HttpResponse.json(ucsbArticlesFixtures.threeArticles[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsbarticles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
