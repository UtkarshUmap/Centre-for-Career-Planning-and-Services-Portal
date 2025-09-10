import { useState } from 'react';
import { createCompany } from '../../api/liaisoningAPIs/company.js';

const AddCompanyForm = ({ setShowCompanyForm, refreshCompanies }) => {
    const [companyData, setCompanyData] = useState({
        company_name: '',
        website: '',
        industry_sector: '',
        address: '',
        created_at: new Date().toISOString()
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({ ...prev, [name]: value }));
    };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Submitting new company:", companyData);
            await createCompany(companyData);
            await refreshCompanies();
            setShowCompanyForm(false);
        } catch (err) {
            console.error("Error creating company:", err);
        } finally {
            setLoading(false);
        }
    };
 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-5 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Add New Company</h2>
                        <p className="text-sm text-slate-500">This will add the company to the master list.</p>
                    </div>
                    <button onClick={() => setShowCompanyForm(false)} className="p-2 rounded-full hover:bg-slate-100">
                        <svg className="h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="companyForm" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-slate-700">Company Name</label>
                            <input type="text" name="company_name" id="company_name" value={companyData.company_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., Acme Corporation" />
                        </div>
                        
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-slate-700">Website</label>
                            <input type="url" name="website" id="website" value={companyData.website} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="https://www.example.com" />
                        </div>
                        
                        <div>
                            <label htmlFor="industry_sector" className="block text-sm font-medium text-slate-700">Industry / Sector</label>
                            <select id="industry_sector" name="industry_sector" value={companyData.industry_sector} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md">
                                <option value="">Select a sector</option>
                                <option>Information Technology</option>
                                <option>Software Development</option>
                                <option>IT Services & Consulting</option>
                                <option>Financial Services (Fintech)</option>
                                <option>Automotive</option>
                                <option>Manufacturing</option>
                                <option>Core Engineering (Mechanical/Civil/Electrical)</option>
                                <option>Electronics & Semiconductor</option>
                                <option>Telecommunications</option>
                                <option>Data Science & Analytics</option>
                                <option>Artificial Intelligence & Machine Learning</option>
                                <option>EdTech</option>
                                <option>Healthcare Technology</option>
                                <option>E-commerce</option>
                                <option>Management Consulting</option>
                                <option>Research & Development</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                            <textarea id="address" name="address" rows="3" value={companyData.address} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Company's primary address..."></textarea>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t bg-slate-50 flex justify-end">
                    <button type="button" onClick={() => setShowCompanyForm(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 mr-3">Cancel</button>
                    <button type="submit" form="companyForm" className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700">
                        {loading ? 'Adding...' : 'Add Company'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AddCompanyForm;