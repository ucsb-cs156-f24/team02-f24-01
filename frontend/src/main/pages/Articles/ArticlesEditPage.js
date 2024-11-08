import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBArticlesForm from "main/components/UCSBArticles/UCSBArticlesForm";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBArticlesEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: ucsbArticles,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbarticles?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbarticles`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (ucsbArticles) => ({
    url: "/api/ucsbarticles",
    method: "PUT",
    params: {
      id: ucsbArticles.id,
    },
    data: {
      title: ucsbArticles.title,
      url: ucsbArticles.url,
      explanation: ucsbArticles.explanation,
      email: ucsbArticles.email,
      dateAdded: ucsbArticles.dateAdded,
    },
  });

  const onSuccess = (ucsbArticles) => {
    toast(
      `UCSBArticle Updated - id: ${ucsbArticles.id} title: ${ucsbArticles.title}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbarticles?id=${id}`],
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
        <h1>Edit UCSBArticle</h1>
        {ucsbArticles && (
          <UCSBArticlesForm
            initialContents={ucsbArticles}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
