import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import User from '../models/User.js';

dotenv.config();

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return defaultValue;
  return ['true', '1', 'yes', 'y'].includes(value.trim().toLowerCase());
};

const creationDefaults = {
  studentId: 'ADMIN-000001',
  fname: 'Main',
  lname: '',
  mname: '',
  phone: '',
  gender: 'other',
  zone: 'Dire Dawa',
  woreda: 'Admin Woreda',
  year: 'Freshman',
  college: 'Administration',
  department: 'Leadership',
};

export const ensureMainAdmin = async (overrides = {}) => {
  const config = {
    email: overrides.email ?? process.env.MAIN_ADMIN_EMAIL,
    password: overrides.password ?? process.env.MAIN_ADMIN_PASSWORD,
    studentId: overrides.studentId ?? process.env.MAIN_ADMIN_STUDENT_ID,
    fname: overrides.fname ?? process.env.MAIN_ADMIN_FNAME,
    lname: overrides.lname ?? process.env.MAIN_ADMIN_LNAME,
    mname: overrides.mname ?? process.env.MAIN_ADMIN_MNAME,
    phone: overrides.phone ?? process.env.MAIN_ADMIN_PHONE,
    gender: overrides.gender ?? process.env.MAIN_ADMIN_GENDER,
    zone: overrides.zone ?? process.env.MAIN_ADMIN_ZONE,
    woreda: overrides.woreda ?? process.env.MAIN_ADMIN_WOREDA,
    year: overrides.year ?? process.env.MAIN_ADMIN_YEAR,
    college: overrides.college ?? process.env.MAIN_ADMIN_COLLEGE,
    department: overrides.department ?? process.env.MAIN_ADMIN_DEPARTMENT,
  };

  const resetPassword = parseBoolean(
    overrides.resetPassword ?? process.env.MAIN_ADMIN_RESET_PASSWORD,
    false
  );

  if (!config.email) {
    console.warn('⚠️  MAIN_ADMIN_EMAIL not configured; skipping main admin seeding.');
    return { status: 'skipped', reason: 'missing-email' };
  }

  const normalizedEmail = config.email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });

  if (!existing) {
    if (!config.password) {
      console.warn(
        '⚠️  MAIN_ADMIN_PASSWORD not configured; unable to create main admin user.'
      );
      return { status: 'skipped', reason: 'missing-password' };
    }

    const newUser = new User({
      email: normalizedEmail,
      password: config.password,
      studentId: config.studentId ?? creationDefaults.studentId,
      role: 'admin',
      mainAdmin: true,
      fname: config.fname ?? creationDefaults.fname,
      lname: config.lname ?? creationDefaults.lname,
      mname: config.mname ?? creationDefaults.mname,
      phone: config.phone ?? creationDefaults.phone,
      gender: config.gender ?? creationDefaults.gender,
      zone: config.zone ?? creationDefaults.zone,
      woreda: config.woreda ?? creationDefaults.woreda,
      year: config.year ?? creationDefaults.year,
      college: config.college ?? creationDefaults.college,
      department: config.department ?? creationDefaults.department,
    });

    await newUser.save();
    console.log(`✅ Main admin created (${normalizedEmail})`);
    return { status: 'created', userId: newUser._id.toString() };
  }

  let updated = false;

  if (existing.role !== 'admin') {
    existing.role = 'admin';
    updated = true;
  }

  if (!existing.mainAdmin) {
    existing.mainAdmin = true;
    updated = true;
  }

  const syncFields = [
    'studentId',
    'fname',
    'lname',
    'mname',
    'phone',
    'gender',
    'zone',
    'woreda',
    'year',
    'college',
    'department',
  ];

  for (const field of syncFields) {
    const provided = config[field];

    if (provided !== undefined && provided !== '' && existing[field] !== provided) {
      existing[field] = provided;
      updated = true;
      continue;
    }

    if (!existing[field] && creationDefaults[field] !== undefined) {
      existing[field] = creationDefaults[field];
      updated = true;
    }
  }

  if ((resetPassword || !existing.password) && config.password) {
    existing.password = config.password;
    updated = true;
  }

  if (updated) {
    await existing.save();
    console.log(`✅ Main admin updated (${normalizedEmail})`);
    return { status: 'updated', userId: existing._id.toString() };
  }

  console.log(`ℹ️ Main admin already configured (${normalizedEmail})`);
  return { status: 'unchanged', userId: existing._id.toString() };
};

const runFromCLI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const emailOverride = process.argv[2];
    const passwordOverride = process.argv[3];

    const overrides = {};
    if (emailOverride) overrides.email = emailOverride;
    if (passwordOverride) {
      overrides.password = passwordOverride;
      overrides.resetPassword = true;
    }

    const result = await ensureMainAdmin(overrides);

    if (result.status === 'skipped') {
      console.warn(`⚠️  Main admin seeding skipped (${result.reason}).`);
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  } catch (error) {
    console.error('❌ Error ensuring main admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

const isDirectExecution = () => {
  if (!process.argv[1]) return false;
  return pathToFileURL(process.argv[1]).href === import.meta.url;
};

if (isDirectExecution()) {
  runFromCLI().finally(() => {
    process.exit(process.exitCode ?? 0);
  });
}
