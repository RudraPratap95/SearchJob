import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { Company } from '../models/company.js';
import { Job } from '../models/job.js';
import { Application } from '../models/application.js';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/searchjob';

async function connect() {
  await mongoose.connect(MONGODB_URI);
}

async function seed() {
  try {
    await connect();
    console.log('Connected to MongoDB:', MONGODB_URI);

    // Clean existing data (use with care)
    await Application.deleteMany({});
    await Job.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});

    // Create users
    const password = bcrypt.hashSync('Password123!', 10);
    const [recruiter, student1, student2] = await User.create([
      {
        fullname: 'Acme Recruiter',
        email: 'recruiter@acme.test',
        phoneNumber: 1234567890,
        password,
        role: 'recruiter',
        profile: { profilePhoto: '', bio: 'Hiring great talent', skills: [] },
      },
      {
        fullname: 'Jane Applicant',
        email: 'jane@example.test',
        phoneNumber: 1112223333,
        password,
        role: 'student',
        profile: { profilePhoto: '', bio: 'Frontend engineer', skills: ['React', 'CSS'] },
      },
      {
        fullname: 'John Applicant',
        email: 'john@example.test',
        phoneNumber: 4445556666,
        password,
        role: 'student',
        profile: { profilePhoto: '', bio: 'Backend enthusiast', skills: ['Node', 'MongoDB'] },
      },
    ]);

    // Create company
    const company = await Company.create({
      name: 'Acme Corp',
      description: 'A mock company for seeding data',
      website: 'https://acme.test',
      location: 'Remote',
      logo: '',
      userId: recruiter._id,
    });

    // Create jobs
    const jobs = await Job.create([
      {
        title: 'Frontend Developer',
        description: 'Work on modern web apps using React and Vite.',
        requirements: ['React', 'JavaScript', 'HTML/CSS'],
        salary: 70000,
        experienceLevel: 2,
        location: 'Remote',
        jobType: 'Full-time',
        position: 1,
        company: company._id,
        created_by: recruiter._id,
      },
      {
        title: 'Backend Developer',
        description: 'Build APIs and services with Node.js and MongoDB.',
        requirements: ['Node.js', 'Express', 'MongoDB'],
        salary: 75000,
        experienceLevel: 3,
        location: 'Remote',
        jobType: 'Full-time',
        position: 1,
        company: company._id,
        created_by: recruiter._id,
      },
    ]);

    // Create applications
    const application1 = await Application.create({ job: jobs[0]._id, applicant: student1._id, status: 'pending' });
    const application2 = await Application.create({ job: jobs[1]._id, applicant: student2._id, status: 'pending' });

    // Attach applications to jobs
    jobs[0].applications = [application1._id];
    jobs[1].applications = [application2._id];
    await jobs[0].save();
    await jobs[1].save();

    console.log('Seed complete:');
    console.log(' Users:', (await User.countDocuments()).toString());
    console.log(' Companies:', (await Company.countDocuments()).toString());
    console.log(' Jobs:', (await Job.countDocuments()).toString());
    console.log(' Applications:', (await Application.countDocuments()).toString());

    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
