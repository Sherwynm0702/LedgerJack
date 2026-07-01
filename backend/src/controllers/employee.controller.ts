import type {Request, Response} from 'express';
import {prisma} from '../utils/prisma.js';

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, salary } = req.body;
 
    // Validation: Check required fields
    if (!name || salary === undefined) {
      return res.status(400).json({ error: 'Name and salary are required' });
    }
 
    // Validation: Check salary is positive number
    if (typeof salary !== 'number' || salary <= 0) {
      return res.status(400).json({ error: 'Salary must be a positive number' });
    }
 
    // Create employee
    const employee = await prisma.employee.create({
      data: { name, salary },
    });
 
    res.status(201).json({
      message: 'Employee created successfully',
      employee,
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 
export const listEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
 
    res.status(200).json({
      employees,
      count: employees.length,
    });
  } catch (error) {
    console.error('List employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEmployee = async(req:Request, res:Response)=>{
  try
  {
    const {id} = req.params;
    await prisma.employee.delete({
      where: { id: Number(id) },
    });

  }
  catch(error){
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const updateEmployee = async (req:Request, res:Response)=>{
  try{
    const {id} = req.params;
    const { name, salary } = req.body;

    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { name, salary },
    });
    res.status(200).json({ message: 'Employee updated successfully', employee });
  }
  catch(error){
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}