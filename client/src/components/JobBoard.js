import JobList from "./JobList";
import { useJobs } from "../graphql/hooks";
 

function JobBoard() {
  const { jobs, loading, error } = useJobs();

  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   console.log("mounted");
  //   // "getJobs" returns a Promise,  usually I use "await" to unpack a Promise, but
  //   // unfortunately we cannot declare this function as "async", because the function we pass to useEffect cannot
  //   // return anything, but an "async" function always returns a Promise, So instead I'm going to call "then" on the Promise,
  //   // getJobs().then(jobs => setJobs(jobs)) below is how we can simplify the code
  //   getJobs()
  //     .then(setJobs)
  //     .catch((err) => setError(true));
  // }, []);

  console.log("[JobBoard] jobs", { jobs, loading, error });
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Sorry, something went wrong </p>;
  }

  // const { jobs } = data;
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
