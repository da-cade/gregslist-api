import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class CarsService {
  async getAllCars() {
    return await dbContext.Cars.find({})
  }

  async getCarById(id) {
    const car = dbContext.Cars.findById(id)
    if (!car) {
      throw new BadRequest()
    }
    return car
  }

  async createCar(body) {
    return await dbContext.Cars.create(body)
  }

  async editCar(update) {
    const original = await this.getCarById(update.id)
    // check ownershup
    if (original.creatorId.toString() !== update.creatorId) {
      throw new Forbidden()
    }
    original.make = update.make || original.make
    original.model = update.model || original.model
    original.color = update.color || original.color
    original.year = update.year || original.year
    original.price = update.price || original.price
    original.imgUrl = update.imgUrl || original.imgUrl
    original.description = update.description || original.description
    await original.save()
    return original
  }

  async deleteCar(id, userId) {
    const car = await this.getCarById(id)
    // check ownership
    if (car.creatorId.toString() !== userId) {
      throw new Forbidden()
    }
    await dbContext.Cars.findByIdAndDelete(id)
  }
}

export const carsService = new CarsService()
