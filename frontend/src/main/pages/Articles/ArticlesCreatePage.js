import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBArticlesForm from "main/components/UCSBArticles/UCSBArticlesForm";

import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticlesCreatePage({ storybook = false }) {
  const objectToAxiosParams = (ucsbArticles) => ({
    url: "/api/ucsbarticles/post",
    method: "POST",
    params: {
      title: ucsbArticles.title,
      url: ucsbArticles.url,
      explanation: ucsbArticles.explanation,
      email: ucsbArticles.email,
      dateAdded: ucsbArticles.dateAdded,
    },
  });

  const onSuccess = (ucsbArticles) => {
    toast(
      `New ucsbArticles Created - id: ${ucsbArticles.id} title: ${ucsbArticles.title}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbarticles/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbarticles" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create a New Article</h1>

        <UCSBArticlesForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
