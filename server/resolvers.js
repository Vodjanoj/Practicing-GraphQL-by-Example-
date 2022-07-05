import { Company, Job } from "./db.js";

export const resolvers = {
  Query: {
    // _root convention for unused variables
    job: (_root, { id }) => Job.findById(id),
    jobs: () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: (_root, { input }, { user }) => {
      console.log(user);
      if (!user) {
        throw new Error("Unathorized");
      }
      return Job.create({ ...input, companyId: user.companyId });
    },
    deleteJob: (_root, { id }) => Job.delete(id),
    updateJob: (_root, { input }) => Job.update(input),
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },

  Job: {
    company: (job) => Company.findById(job.companyId),
  },
};
