import mongoose from 'mongoose';

const {{name}}Schema = new mongoose.Schema(
  {
    // TODO: define your fields here
    // name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const {{name}} =
  mongoose.models.{{name}} || mongoose.model('{{name}}', {{name}}Schema);

export default {{name}};
