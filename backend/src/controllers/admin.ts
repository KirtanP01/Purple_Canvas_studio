import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db/index.js';

// Admin login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // For simplicity, using hardcoded admin credentials
    // In production, this should be stored in database with hashed password
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign(
      { id: 1, username: ADMIN_USERNAME, role: 'admin' },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: 1,
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get all painting party bookings
export const getPaintingPartyBookings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM painting_parties ORDER BY party_date DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching painting party bookings:', error);
    res.status(500).json({ error: 'Failed to fetch painting party bookings' });
  }
};

// Get all birthday party bookings
export const getBirthdayPartyBookings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM birthday_parties ORDER BY party_date DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching birthday party bookings:', error);
    res.status(500).json({ error: 'Failed to fetch birthday party bookings' });
  }
};

// Get all art class bookings
export const getArtClassBookings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM art_classes ORDER BY class_date DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching art class bookings:', error);
    res.status(500).json({ error: 'Failed to fetch art class bookings' });
  }
};

// Get all bookings combined
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const [paintingParties, birthdayParties, artClasses] = await Promise.all([
      pool.query('SELECT *, \'painting_party\' as type FROM painting_parties ORDER BY party_date DESC'),
      pool.query('SELECT *, \'birthday_party\' as type FROM birthday_parties ORDER BY party_date DESC'),
      pool.query('SELECT *, \'art_class\' as type FROM art_classes ORDER BY class_date DESC')
    ]);

    res.json({
      paintingParties: paintingParties.rows,
      birthdayParties: birthdayParties.rows,
      artClasses: artClasses.rows,
      total: paintingParties.rows.length + birthdayParties.rows.length + artClasses.rows.length
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
