import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import BloodInventory from '../models/BloodInventory.js'
import Ambulance from '../models/Ambulance.js'
import { ROLES, BLOOD_GROUPS } from '../constants/index.js'
import logger from '../utils/logger.js'

const SEED_USERS = [
  {
    name: 'Admin User',
    email: 'admin@bloodlink.app',
    password: 'Admin@1234',
    role: ROLES.ADMIN,
    phone: '+91 9000000001',
  },
  {
    name: 'Patient Demo',
    email: 'patient@bloodlink.app',
    password: 'Demo@1234',
    role: ROLES.PATIENT,
    bloodType: 'O+',
    phone: '+91 9000000002',
  },
  {
    name: 'Ravi Kumar (Donor)',
    email: 'donor@bloodlink.app',
    password: 'Demo@1234',
    role: ROLES.DONOR,
    bloodType: 'O+',
    phone: '+91 9000000003',
    isAvailable: true,
    age: 28,
    weight: 68,
  },
  {
    name: 'City Blood Bank',
    email: 'bank@bloodlink.app',
    password: 'Demo@1234',
    role: ROLES.BLOOD_BANK,
    phone: '+91 9000000004',
    location: { address: 'Vizag', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  },
  {
    name: 'Emergency Ambulance Co.',
    email: 'ambulance@bloodlink.app',
    password: 'Demo@1234',
    role: ROLES.AMBULANCE,
    phone: '+91 9000000005',
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    logger.info('Connected to MongoDB for seeding')

    // Clear existing
    await User.deleteMany({})
    await BloodInventory.deleteMany({})
    await Ambulance.deleteMany({})
    logger.info('Cleared existing seed data')

    // Create users
    const users = await User.create(SEED_USERS)
    logger.info(`Created ${users.length} seed users`)

    // Create inventory for blood bank
    const bank = users.find((u) => u.role === ROLES.BLOOD_BANK)
    await BloodInventory.create({
      bloodBank: bank._id,
      stock: BLOOD_GROUPS.map((bg) => ({
        bloodGroup: bg,
        units: Math.floor(Math.random() * 60) + 5,
        minThreshold: 10,
      })),
      address: 'City Blood Bank, Siripuram, Visakhapatnam',
      phone: '+91 9000000004',
    })
    logger.info('Blood inventory seeded')

    // Create ambulance unit
    const ambUser = users.find((u) => u.role === ROLES.AMBULANCE)
    await Ambulance.create({
      operator: ambUser._id,
      driverName: 'Suresh Babu',
      driverPhone: '+91 9876543210',
      vehicleNumber: 'AP31AB1234',
      vehicleType: 'advanced',
      status: 'available',
    })
    logger.info('Ambulance unit seeded')

    logger.info('\n✅ Seed complete! Login credentials:')
    SEED_USERS.forEach((u) => {
      logger.info(`  [${u.role.padEnd(10)}] ${u.email} / ${u.password}`)
    })

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    logger.error(`Seed failed: ${err.message}`)
    process.exit(1)
  }
}

seed()
