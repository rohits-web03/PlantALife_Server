import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";

const addTransaction=async (req, res) => {
    try {
      // Extract required parameters from query parameters
      const { receiverID, amount, date } = req.query;
  
      // Create a new transaction
      const newTransaction = new Transaction({
        receiver: receiverID,
        amount: Number(amount),
        date: new Date(date)
      });
  
      // Save the transaction to the database
      const savedTransaction = await newTransaction.save();
  
      // Retrieve the User document corresponding to the receiver ID
      const receiverUser = await User.findById(receiverID);
  
      // Add the ID of the newly created transaction to the User's transaction array
      receiverUser.transactions.push(savedTransaction._id);
  
      // Save the updated User document to the database
      await receiverUser.save({ validateBeforeSave: false });
  
      // Return a success response with the ID of the newly created transaction
      res.status(201).json({ message: 'Transaction added successfully', transactionID: savedTransaction._id });
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export {addTransaction}