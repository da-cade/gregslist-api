import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden, NotFound } from '../utils/Errors'

class HousesService {
  async getAllHouses() {
    return await dbContext.Houses.find({})
  }

  async getHouseById(houseId) {
    const house = await dbContext.Houses.findById(houseId)
    if (!house) {
      throw new BadRequest()
    }
    return house
  }

  async createHouse(body) {
    const house = await dbContext.Houses.create(body)
    await house.populate('creator', 'picture name')
    return house
  }

  async editHouse(updatedHouse) {
    const originalHouse = await dbContext.Houses.findById(updatedHouse.id)
    if (!originalHouse) {
      throw new NotFound('House not found')
    }
    if (originalHouse.creatorId.toString() !== updatedHouse.creatorId) {
      throw new Forbidden()
    }
    originalHouse.bedrooms = updatedHouse.bedrooms || originalHouse.bedrooms
    originalHouse.bathrooms = updatedHouse.bathrooms || originalHouse.bathrooms
    originalHouse.levels = updatedHouse.levels || originalHouse.levels
    originalHouse.price = updatedHouse.price || originalHouse.price
    originalHouse.year = updatedHouse.year || originalHouse.year
    originalHouse.imgUrl = updatedHouse.imgUrl || originalHouse.imgUrl
    originalHouse.description = updatedHouse.description || originalHouse.description
    await originalHouse.save()
    return originalHouse
  }

  async deleteHouse(houseId, userId) {
    const house = await this.getHouseById(houseId)
    if (house.creatorId.toString() !== userId) { // toString() is necessary bc the creatorId is a BSON object
      throw new Forbidden()
    }
    const deletedHouse = await dbContext.Houses.findByIdAndDelete(houseId)
    return deletedHouse
  }
}

export const housesService = new HousesService()
