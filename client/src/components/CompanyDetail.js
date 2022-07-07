import { useParams } from "react-router";
import { useCompany } from "../graphql/hooks";
import JobList from "./JobList";

function CompanyDetail() {
  const { companyId } = useParams();
  const { company, loading } = useCompany(companyId);

  // const company = companies.find((company) => company.id === companyId);

  // useEffect(() => {
  //   getCompany(companyId).then(setCompany);
  // }, [companyId]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h5 className="title is-5">Jobs at {company.name}</h5>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyDetail;
