
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./services/CompanyService";
import type { company } from "./types/company";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [companies, setCompanies] = useState<company[]>([]);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      console.error("Failed to fetch companies", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCompany(newCompany: company) {
    try {
      const created = await createCompany(newCompany);
      setCompanies((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to add company", error);
      setError(error as Error);
    }
  }

  async function handleEditCompany(updatedCompany: company) {
    try {
      const saved = await updateCompany(updatedCompany.id, updatedCompany);
      setCompanies((prev) => prev.map((company) => (company.id === saved.id ? saved : company)));
    } catch (error) {
      console.error("Failed to edit company", error);
      setError(error as Error);
    }
  }

  async function handleDeleteCompany(id: number) {
    try {
      await deleteCompany(id);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
    } catch (error) {
      console.error("Failed to delete company", error);
      setError(error as Error);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) {
    return <div>Loading companies...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <NavBar />
      <Welcome />
      <CompanyCard
        companies={companies}
        onadd={handleAddCompany}
        onedit={handleEditCompany}
        ondelete={handleDeleteCompany}
      />
      <JobCard />
      <Footer />
    </>
  );
}
export default App;


