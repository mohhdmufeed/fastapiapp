import axios from "axios";
import type {company} from "../types/company";

const API_BASE_URL = "http://localhost:8000";
export async function getCompanies(): Promise<company[]> {
    const response = await axios.get(`${API_BASE_URL}/company`);
    return response.data;
}

export async function getCompany(id: number): 
    Promise<company> {
        const response = await axios.get(`${API_BASE_URL}/company/${id}`);
        return response.data;
}

export async function createCompany(company: company): Promise<company> {
    const response = await axios.post(`${API_BASE_URL}/company`,company);
    return response.data;
}

export async function updateCompany(id: number,company: company): Promise<company> {
    const response = await axios.put(`${API_BASE_URL}/company/${id}`,company);
    return response.data;
}

export async function deleteCompany(id: number): Promise<void> {
    const response = await axios.delete(`${API_BASE_URL}/company/${id}`);
    return response.data;
}

