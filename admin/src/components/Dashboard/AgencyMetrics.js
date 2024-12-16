import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getAgencies } from '../../services/firestoreService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AgencyMetrics = () => {
  const [agencies, setAgencies] = useState([]); 
  const [approvedCount, setApprovedCount] = useState(0);
  const [industryData, setIndustryData] = useState([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      const fetchedAgencies = await getAgencies();
      setAgencies(fetchedAgencies);
    };
    fetchAgencies();
  }, []);

  useEffect(() => {
    if (agencies.length > 0) {
      const approved = agencies.filter(agency => agency.isApproved).length;
      setApprovedCount(approved);

      const industryGroups = agencies.reduce((acc, agency) => {
        acc[agency.industry] = (acc[agency.industry] || 0) + 1;
        return acc;
      }, {});

      const industryChartData = Object.keys(industryGroups).map(industry => ({
        name: industry,
        value: industryGroups[industry]
      }));

      setIndustryData(industryChartData);
    }
  }, [agencies]);

  return (
    <div className="metrics-section bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary">Total Agencies</h2>
          <p className="text-2xl text-gray-700">{agencies.length}</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary">Approved Agencies</h2>
          <p className="text-2xl text-green-600">{approvedCount}</p>
        </div>
      </div>
      <div className="pie-chart">
        <h3 className="text-xl font-semibold text-secondary mb-4">Industry Segmentation</h3>
        {industryData.length > 0 ? (
          <PieChart width={400} height={300}>
            <Pie
              data={industryData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {industryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p>No industry data available</p>
        )}
      </div>
    </div>
  );
};

export default AgencyMetrics;
