import ExpenseModel from "./expense.model.js";
import ExpenseRepository from "./expense.repository.js";

export default class ExpenseController {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  // Create new expense
  add = async (req, res) => {
    try{
    const{title, amount, date, isRecurring, tags} = req.body;
    const newexpanse =new ExpenseModel(title, amount, date, isRecurring, tags);
    const addexpanse =await this.expenseRepository.addExpense(newexpanse);
    res.status(201).send(addexpanse);
  }catch(err){
    console.log(err);
    return res.status(201).send("Something went wrong");
  }
  };

  // Get a specific expense
  getOne = async (req, res) => {
    try {
      const id = req.params.id; // Get the ID from the request parameters
      const expense = await this.expenseRepository.getOne(id); // Fetch the expense from the repository
      if (expense) {
        return res.status(200).json(expense); // Return the expense if found
      } else {
        return res.status(404).send("Expense not found"); // Return 404 if not found
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  };

  // Get all expenses
  getAll = async (req, res) => { try {
    const expenses = await this.expenseRepository.getAllExpenses(); // Fetch all expenses from the repository
    return res.status(200).json(expenses); // Return the list of expenses
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }};

  // Add a tag to an expense
  addTag = async (req, res) => {try {
    const id = req.params.id; // Get the expense ID from the request parameters
    const { tags } = req.body; // Get the tag from the request body
    const updatedExpense = await this.expenseRepository.addTagToExpense(id, tags); // Add the tag to the expense
    if (updatedExpense.modifiedCount > 0) {
      return res.status(200).send("Tag added successfully");
    } else {
      return res.status(404).send("Expense not found or no changes made");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }};

  // Filter expenses based on given criteria
  filter = async (req, res) => {  try {
    const { minAmount, maxAmount, isRecurring } = req.query;

    // Build the filter criteria
    let criteria = {};

    if (minAmount) {
      criteria.amount = { ...criteria.amount, $gte: parseFloat(minAmount) };
    }

    if (maxAmount) {
      criteria.amount = { ...criteria.amount, $lte: parseFloat(maxAmount) };
    }

    if (isRecurring !== undefined) {
      criteria.isRecurring = isRecurring === 'true';
    }

    // Fetch filtered expenses from the repository
    const filteredExpenses = await this.expenseRepository.filterExpenses(criteria);

    return res.status(200).json(filteredExpenses); // Return the filtered expenses
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
}
}
