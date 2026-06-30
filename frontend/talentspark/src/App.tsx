
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"
import { useEffect,useState } from "react";
import { getCompanies } from "./services/CompanyService";
import type { company } from "./types/company";

function App(){
  const [loading,setLoading] =useState(true);
  const[error,setError] = useState<Error | null>(null);
  const [companies,setCompanies]=useState<company[]>([]);

  async function fetchCompanies(){
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
      setLoading(false);
    } catch (error){
      console.error("Failed to fetch companies",error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchCompanies();
  },[]);

  if(loading){
    return <div>Loading companies...</div>
  }

  if(error){
    return <div>Error: {error.message}</div>
  }

  return (
    <>
    <NavBar/>
    <Welcome/>
    <CompanyCard
    companies = {companies}/>   
    <JobCard/>
    <Footer/>
    </>
  )
}
export default App


