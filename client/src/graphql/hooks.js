import { COMPANY_QUERY, JOBS_QUERY, JOB_QUERY } from "../graphql/queries";
import { useQuery } from "@apollo/client";

export function useJob(id) {
  const { data, loading, error } = useQuery(JOB_QUERY, {
    variables: { id },
  });
  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

export function useCompany(id) {
  const { data, loading, error } = useQuery(COMPANY_QUERY, {
    variables: { id },
  });
  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });
  return {
    // I'm using the optional chaining operator to read the "jobs" property only if "data" is defined.
    jobs: data?.jobs,
    loading,
    // convert error to a boolen
    error: Boolean(error),
  };
}
