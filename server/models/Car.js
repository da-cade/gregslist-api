import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const CarSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String },
  year: { type: Number, max: 2022, min: 1920, required: true },
  price: { type: Number, required: true, min: 1, max: 1000000 },
  description: { type: String, maxLength: 300 },
  imgUrl: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTkfieV9qkyi3x1vDnyrR8wjVwxhagV13Hvw&usqp=CAU' },
  creatorId: { type: Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true, toJSON: { virtuals: true } })

// a virtual is a fake a poperty that is added by mongoose but is not stored in mongoDB
CarSchema.virtual('creator', {
  localField: 'creatorId',
  ref: 'Account',
  foreignField: '_id',
  justOne: true
})
