import { JOBS_QUERY } from "../graphql/queries";
import { useQuery } from "@apollo/client";

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