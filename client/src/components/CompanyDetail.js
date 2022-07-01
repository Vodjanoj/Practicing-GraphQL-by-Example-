import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany } from "../graphql/queries";

function CompanyDetail() {
  const [company, setCompany] = useState(null);
  const { companyId } = useParams();

  // const company = companies.find((company) => company.id === companyId);

  useEffect(() => {
    getCompany(companyId).then(setCompany);
  }, [companyId]);

  console.log("company", company);

  if (!company) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
    </div>
  );
}

export default CompanyDetail;
