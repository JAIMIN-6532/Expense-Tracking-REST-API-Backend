export default class ExpenseModel {
  constructor(title, amount, date, isRecurring, tags,id) {
    this.title = title;
    this.amount = amount;
    this.date = date;
    this.isRecurring = isRecurring;
    this.tags = tags;
    this._id = id;
  }
}
