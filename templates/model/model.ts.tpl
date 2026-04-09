import mongoose, { Document, Model, Schema } from 'mongoose';

export interface I{{name}} extends Document {
  // TODO: define your fields here
  // name: string;
  createdAt: Date;
  updatedAt: Date;
}

const {{name}}Schema: Schema<I{{name}}> = new Schema(
  {
    // TODO: define your fields here
    // name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const {{name}}: Model<I{{name}}> =
  (mongoose.models.{{name}} as Model<I{{name}}>) ||
  mongoose.model<I{{name}}>('{{name}}', {{name}}Schema);

export default {{name}};
