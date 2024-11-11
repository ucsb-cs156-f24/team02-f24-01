import React from "react";
import UCSBArticlesForm from "main/components/UCSBArticles/UCSBArticlesForm";
import { ucsbArticlesFixtures } from "fixtures/ucsbArticlesFixtures";

export default {
  title: "components/UCSBArticles/UCSBArticlesForm",
  component: UCSBArticlesForm,
};

const Template = (args) => {
  return <UCSBArticlesForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: ucsbArticlesFixtures.oneArticle,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
