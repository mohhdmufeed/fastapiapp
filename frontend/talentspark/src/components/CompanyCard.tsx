import type {company} from "../types/company";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCompanies } from "../services/CompanyService";
import {useState} from "react";

type Props = {
    companies:company[];
    onedit: (company:company)=>void;
    ondelete: (id:number)=>void;
    onadd: (company:company)=>void;
}


function CompanyCard({
    companies,onadd,onedit,ondelete}:Props){
    const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
    const [editform,setEditform] = useState<company>({
        id:0,
        name:"",
        email:"",
        phone:"",
        location:"",
        jobs:[]
    });
    const [addform,setAddform] = useState<company>({
        id:0,
        name:"",
        email:"",
        phone:"",
        location:"",
        jobs:[]
    });

    const handleAdd = () => {
        onadd(addform);
        setAddform({
            id:0,
            name:"",
            email:"",
            phone:"",
            location:"",
            jobs:[]
        });
    }

    const handleEdit = () => {
        onedit(editform);
        setEditCompanyId(null);
    }

    const handleDelete = (id:number) => {
        ondelete(id);
    }

    const startEdit = (company:company) => {
        setEditCompanyId(company.id);
        setEditform({
            id:company.id,
            name:company.name,
            email:company.email,
            phone:company.phone,
            location:company.location,
            jobs:company.jobs
        });
    }

    return(
        <div>
            {companies.map((company) => (
                <div key={company.id}>
                    {editCompanyId === company.id ? (
                        <>
                            <input type="text" value={editform.name} onChange={(e)=>setEditform({...editform,name:e.target.value})} />
                            <input type="text" value={editform.email} onChange={(e)=>setEditform({...editform,email:e.target.value})} />
                            <input type="text" value={editform.phone} onChange={(e)=>setEditform({...editform,phone:e.target.value})} />
                            <input type="text" value={editform.location} onChange={(e)=>setEditform({...editform,location:e.target.value})} />
                            <button onClick={handleEdit}>Save</button>
                            <button onClick={() => setEditCompanyId(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <h1>{company.name}</h1>
                            <p>Email: {company.email}</p>
                            <p>Phone: {company.phone}</p>
                            <p>Location: {company.location}</p>
                        </>
                    )}
                    <button onClick={() => startEdit(company)}>Edit</button>
                    <button onClick={() => handleDelete(company.id)}>Delete</button>
                    <hr></hr>
                </div>
            ))}

            <h2>Add New Company</h2>
            <input type="text" placeholder="Name" value={addform.name} onChange={(e)=>setAddform({...addform,name:e.target.value})} />
            <input type="text" placeholder="Email" value={addform.email} onChange={(e)=>setAddform({...addform,email:e.target.value})} />
            <input type="text" placeholder="Phone" value={addform.phone} onChange={(e)=>setAddform({...addform,phone:e.target.value})} />
            <input type="text" placeholder="Location" value={addform.location} onChange={(e)=>setAddform({...addform,location:e.target.value})} />
            <button onClick={handleAdd}>Add Company</button>
        </div>
    )
}

export default CompanyCard