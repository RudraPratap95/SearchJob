import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group.jsx'
import { Label } from '@radix-ui/react-label'

const filterData = [
    {
        filterType: "Location",
        array: ["Any", "Delhi", "Noida", "Gurugram", "Hyderabad", "Bangalore", "Pune", "Mumbai"]
    },
    {
        filterType: "Role",
        array: ["Any", "Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["Any", "0-5 LPA", "5-10 LPA", "10+ LPA"]
    },
    {
        filterType: "Experience",
        array: ["Any", "Fresher", "1-3 years", "3+ years"]
    },
    {
        filterType: "Job Type",
        array: ["Any", "Full-time", "Part-time", "Remote", "Internship"]
    }
]

const FilterCard = ({ activeFilters, setActiveFilters }) => {
    const getActiveValue = (category) => {
        return activeFilters?.[category]?.[0] || "Any";
    }

    const changeHandler = (category, value) => {
        setActiveFilters((prev) => {
            const next = { ...prev };
            if (!value || value === "Any") {
                delete next[category];
            } else {
                next[category] = [value];
            }
            return next;
        });
    }

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <div className='space-y-6 mt-4'>
                {filterData.map((data, index) => (
                    <div key={data.filterType}>
                        <h2 className='font-semibold text-sm mb-3 text-gray-700'>{data.filterType}</h2>
                        <RadioGroup
                            value={getActiveValue(data.filterType)}
                            onValueChange={(value) => changeHandler(data.filterType, value)}
                            className='space-y-2'
                        >
                            {data.array.map((item, idx) => {
                                const itemId = `filter-${index}-${idx}`;
                                return (
                                    <div key={itemId} className='flex items-center gap-2'>
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label htmlFor={itemId} className='text-sm text-gray-600'>
                                            {item}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterCard;
