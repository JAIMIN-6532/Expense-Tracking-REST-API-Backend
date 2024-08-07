import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

class ExpenseRepository {
  constructor() {
    this.collectionName = "expenses"; // name of the collection in mongodb
  }

  // Create a new expense
  async addExpense(expense) {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      await collection.insertOne(expense);
      return expense;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // Get one expnese by its ID
  async getOne(id) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get all expenses
  async getAllExpenses() {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.find({}).toArray();
  }

  // Add tag to an expense
  async addTagToExpense(id, tag) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { tags: tag } }
    );
  }

  // Filter expenses based on date, amount, and isRecurring field
  async filterExpenses(criteria) {
    const db = getDB();
    const collection = db.collection(this.collectionName);
    return await collection.find(criteria).toArray();
  }
}

export default ExpenseRepository;
