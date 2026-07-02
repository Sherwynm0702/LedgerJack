import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export const calculatePayroll = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validation: Check required field
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Validation: Check employeeId is a number
    if (typeof employeeId !== 'number') {
      return res.status(400).json({ error: 'Employee ID must be a number' });
    }

    // Get employee — scoped to the requesting user
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, userId },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Basic calculation: salary as payroll amount
    const payrollAmount = employee.salary;

    // Create payroll record
    const payrollRecord = await prisma.payrollRecord.create({
      data: {
        employeeId,
        amount: payrollAmount,
      },
    });

    res.status(201).json({
      message: 'Payroll calculated successfully',
      payroll: {
        employeeId: employee.id,
        employeeName: employee.name,
        salary: employee.salary,
        payrollAmount,
        payrollDate: payrollRecord.date,
      },
    });
  } catch (error) {
    console.error('Calculate payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayrollRecords = async (req: Request, res: Response) => {
  try{
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Only return payroll records for employees owned by this user
    const payrollRecords = await prisma.payrollRecord.findMany({
      where: { employee: { userId } },
      orderBy: { date: 'desc' },
      include: {
        employee: true,
      },
    });
    res.status(200).json({payrollRecords, count : payrollRecords.length});
  }
  catch(error){
    console.error('Get payroll records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};