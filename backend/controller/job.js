import { Job } from "../models/job.js";

//admin post krega job
export const postJob = async(req,res)=>{
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId
        })
        return res.status(201).json({
            message:"New job created successfully",
            job,
            success:true
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

//student k liye
export const getAllJobs = async(req,res)=>{
    try {
        const keyword = req.query.keyword?.trim() || "";
        const location = req.query.location;
        const role = req.query.role;
        const jobType = req.query.jobType;
        const salaryRange = req.query.salaryRange;
        const experience = req.query.experience;

        const query = {};
        const filters = [];

        if (keyword) {
            filters.push({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { location: { $regex: keyword, $options: "i" } },
                    { jobType: { $regex: keyword, $options: "i" } },
                ],
            });
        }

        if (location && location !== "Any") {
            filters.push({ location: { $regex: `^${location}$`, $options: "i" } });
        }

        if (role && role !== "Any") {
            filters.push({ title: { $regex: role, $options: "i" } });
        }

        if (jobType && jobType !== "Any") {
            filters.push({ jobType: { $regex: `^${jobType}$`, $options: "i" } });
        }

        if (salaryRange && salaryRange !== "Any") {
            if (salaryRange === "0-5 LPA") {
                filters.push({ salary: { $lte: 5 } });
            } else if (salaryRange === "5-10 LPA") {
                filters.push({ salary: { $gt: 5, $lte: 10 } });
            } else if (salaryRange === "10+ LPA") {
                filters.push({ salary: { $gt: 10 } });
            }
        }

        if (experience && experience !== "Any") {
            if (experience === "Fresher") {
                filters.push({ experienceLevel: 0 });
            } else if (experience === "1-3 years") {
                filters.push({ experienceLevel: { $gte: 1, $lte: 3 } });
            } else if (experience === "3+ years") {
                filters.push({ experienceLevel: { $gt: 3 } });
            }
        }

        if (filters.length > 0) {
            query.$and = filters;
        }

        const jobs = await Job.find(query).populate({
            path: "company",
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

//student k liye
export const getJobById = async (req,res)=>{
   try {
     const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path:"applications"
    });
    if(!job){
        return res.status(404).json({
            message:"Job not found",
            success:false
        })
    }
    return res.status(200).json({
        job,
        success:true 
    })
   } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
   }
}

//admin kitne job create kra h abhi tk
export const getAdminJobs = async (req,res)=>{
  try {
      const adminId = req.id;
    const jobs = await Job.find({created_by:adminId}).populate({
        path:"company"
    }).sort({createdAt:-1});
    if(!jobs){
        return res.status(404).json({
            message:"Jobs not found",
            success:false
        })
    }
    return res.status(200).json({
        jobs,
        success:true
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}