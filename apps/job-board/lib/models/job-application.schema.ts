import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  company: string;
  position: string;
  location?: string;
  status: string;
  columnId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  userId: string;
  order: number;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  appliedDate?: Date;
  tags?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IJobModel extends mongoose.Model<IJobApplication> {
  getNextOrder(columnId: string | mongoose.Types.ObjectId): Promise<number>;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'applied',
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: 'Column',
      required: true,
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
    salary: {
      type: String,
    },
    jobUrl: {
      type: String,
    },
    appliedDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

JobApplicationSchema.statics.getNextOrder = async function (columnId) {
  const lastJob = await this.findOne({ columnId })
    .sort({ order: -1 })
    .select('order')
    .lean();

  return lastJob ? lastJob.order + 1 : 0;
};

JobApplicationSchema.index({ userId: 1, boardId: 1 });

const JobApplication =
  (mongoose.models.JobApplication as IJobModel) ||
  mongoose.model<IJobApplication, IJobModel>(
    'JobApplication',
    JobApplicationSchema,
  );

export default JobApplication;
