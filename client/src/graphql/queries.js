import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      # job is an alias
      job: createJob(input: $input) {
        # since we're only using the job ID from the response, we could actually remove
        # all these other fields. This way we reduce the size of the response a little bit.
        id
      }
    }
  `;

  const variables = { input };

  const context = { headers: { Authorization: "Bearer " + getAccessToken() } };
  const {
    data: { job },
  } = await client.mutate({ mutation, variables, context });

  return job;
}

// export async function createJob(input) {
//   const query = gql`
//     mutation CreateJobMutation($input: CreateJobInput!) {
//       # job is an alias
//       job: createJob(input: $input) {
//         # since we're only using the job ID from the response, we could actually remove
//         # all these other fields. This way we reduce the size of the response a little bit.
//         id
//       }
//     }
//   `;

//   const variables = { input };
//   const headers = { Authorization: "Bearer " + getAccessToken() };
//   const { job } = await request(GRAPHQL_URL, query, variables, headers);
//   return job;
// }

export async function getCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;

  const variables = { id };
  const {
    data: { company },
  } = await client.query({ query, variables });
  // const { company } = await request(GRAPHQL_URL, query, variables);
  return company;
}

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;

  const variables = { id };
  const {
    data: { job },
  } = await client.query({ query, variables });

  // const { job } = await request(GRAPHQL_URL, query, variables);
  return job;
}

export async function getJobs() {
  const query = gql`
    query JobsQuery {
      jobs {
        id
        title
        description
        company {
          name
        }
      }
    }
  `;

  const {
    data: { jobs },
  } = await client.query({ query });

  // const { jobs } = await request(GRAPHQL_URL, query);
  return jobs;
}
