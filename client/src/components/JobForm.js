import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CREATE_JOB_MUTATION } from "../graphql/queries";
import { getAccessToken } from "../auth";
import { JOB_QUERY } from "../graphql/queries";

function JobForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // "useMutation" works a bit differently from useQuery in that it returns an array.
  // The first element in this array is a function that we can use to execute the mutation,
  // so let's call it "mutate", the second element is the "result" of the mutation.
  // This "result" object is similar to the one returned by useQuery, in that it gives us access to the "data",
  // "loading" and "error" properties. But there's an important difference compared to useQuery.
  // When we make a query we typically want to load the data immediately, as soon as the component is
  // mounted, so calling "useQuery" will fetch the data straight away. But with a mutation, we don't usually
  // want to send the request immediately. Like, in this case we only want to create a new job
  // after the user has filled in the form and clicked the "submit" button. For this rea son, calling "useMutation" will
  // not actually send a request to the server.  It simply prepares the mutation, that we'll execute later.
  // That's why we may not even need this "result" object.

  const [mutate] = useMutation(CREATE_JOB_MUTATION);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      context: {
        headers: { Authorization: "Bearer " + getAccessToken() },
      },
      update: (cache, { data: { job } }) => {
        cache.writeQuery({
          query: JOB_QUERY,
          variables: { id: job.id },
          data: { job },
        });
      },
    });

    // const job = await createJob({ title, description });
    console.log("job created", job.id);
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
