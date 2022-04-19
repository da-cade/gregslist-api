import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const HouseSchema = new Schema({
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  levels: { type: Number },
  year: { type: Number },
  price: { type: Number, required: true },
  imgUrl: { type: String },
  description: { type: String },
  creatorId: { type: Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true, toJSON: { virtuals: true } })

HouseSchema.virtual('creator', {
  localField: 'creatorId',
  ref: 'Account',
  foreignField: '_id',
  justOne: true
})
