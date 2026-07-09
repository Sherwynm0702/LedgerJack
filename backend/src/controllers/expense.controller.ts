import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, category } = req.body;
    const userId = req.user?.userId;
    
    // Validation: Check required fields
    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category are required' });
    }
 
    // Validation: Check amount is positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Create expense
    const expense = await prisma.expense.create({
      data: { amount, category, userId },
    });
 
    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const listExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
       }
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
 
    res.status(200).json({
      expenses,
      count: expenses.length,
    });
  } catch (error) {
    console.error('List expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({ expense });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, category } = req.body;
    const userId = req.user?.userId;
 
    // Validation: Check at least one field to update
    if (!amount && !category) {
      return res.status(400).json({ error: 'At least one field (amount or category) is required' });
    }
    // Validation: Check amount is positive if provided
    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (typeof id !== 'string') {
  return res.status(400).json({ error: 'Invalid expense ID' });
}
if (!userId) {
  return res.status(401).json({ error: 'User not authenticated' });
}
    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: { id: parseInt(id), userId },
    });
 
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
 
    // Update expense
    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: { amount, category },
    });
 
    res.status(200).json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: { id: parseInt(id), userId },
    });
 
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    // Delete expense
    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Expense deleted successfully' });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};