import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//custom hook
const useGetAllJobs = (filters = {}) => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((store) => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const params = new URLSearchParams();
                if (searchedQuery) params.append("keyword", searchedQuery);

                const fieldMap = {
                    Location: "location",
                    Role: "role",
                    "Job Type": "jobType",
                    Salary: "salaryRange",
                    Experience: "experience",
                };

                Object.entries(filters).forEach(([category, values]) => {
                    const value = values?.[0];
                    const key = fieldMap[category];
                    if (key && value && value !== "Any") {
                        params.append(key, value);
                    }
                });

                const url = `${JOB_API_END_POINT}/get${params.toString() ? `?${params.toString()}` : ""}`;
                const res = await axios.get(url, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllJobs();
    }, [searchedQuery, JSON.stringify(filters), dispatch]);
};

export default useGetAllJobs
