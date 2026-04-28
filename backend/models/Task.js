const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
