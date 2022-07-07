import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      # job is an alias
      job: createJob(input: $input) {
        # we need also all these data to store in the cache and then use the data
        # to display in the component
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `;

  const variables = { input };

  const context = { headers: { Authorization: "Bearer " + getAccessToken() } };
  // update updates data in the cache
  // "result" is the same object we get when we call "client.mutate", so it contains the
  // data in the GraphQL response, therefore we can destructure that "result" object here in the same way.
  // { data: {job} }
  // update - so this is how we can write some data directly into the cache.
  // We are effectively storing the same data that is normally fetched by the "job" query, but in this
  // case we're doing it manually, after a "createJob" mutation.
  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      });
    },
  });

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
  const variables = { id };
  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });

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
          # For each company, in addition to the name we also want to request its ID, even if we
          # don't display it on the page. It's a good rule to follow when using Apollo Client
          # always request the ID field for any object.
          # (caching)
          id
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
