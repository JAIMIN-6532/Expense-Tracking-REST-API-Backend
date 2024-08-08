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


  // Update a tag in an expense
  async updateTagInExpense(id, oldTag, newTag) {
    const db = getDB();
    const expenses = db.collection(this.collectionName);
  
    // Pull the old tag
    await expenses.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { tags: oldTag } }
    );
  
    // Push the new tag
    const result = await expenses.updateOne(
      { _id: new ObjectId(id) },
      { $push: { tags: newTag } }
    );
  return result;
    
    
  }

  // Delete a tag from an expense
  async deleteTagFromExpense(id, tag) {
    const db = getDB();
    const expenses = db.collection(this.collectionName);
    return await expenses.updateOne({_id:new ObjectId(id) }, {$pull:{tags:tag}});
    
  }

  
  // Aggregate total revenue for each product
  async aggregateTotalRevenue() {
    try{
    const db = getDB();
   return db.collection(this.collectionName).aggregate([
      {
        $group:{
          _id:"$title",
          totalRevenue:{$sum:"$amount"}
        }
      }
    ]).toArray();
  }catch(err){
    console.log(err);
    throw new ApplicationError("Something went wrong with database", 500);    
  }
  }

  // Group expenses by tags
  async groupExpensesByTags() {
    try{
      const db = getDB();
      return db.collection(this.collectionName).aggregate([
        { $unwind: "$tags" },  // Unwind the tags array
      {
        $group: {
          _id: "$tags",  // Group by each tag
          totalAmount: { $sum: "$amount" },  // Sum the amount of expenses for each tag
          expenses: { $push: "$$ROOT" }  // Push the entire document into an array for reference
        }
      }

      ]).toArray();

    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);    
    }
  }

  // Group and calculate average by recurring status
  async groupAndCalculateAvgByRecurring() {
    try{
      const db = getDB();
     return db.collection(this.collectionName).aggregate([
        {
          $group:{
            _id:"$isRecurring",
           avgAmount:{$avg:"$amount"}
          }
        }
      ]).toArray();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);    
    }
  }
}

export default ExpenseRepository;
