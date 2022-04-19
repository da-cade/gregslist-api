import { Auth0Provider } from '@bcwdev/auth0provider'
import { housesService } from '../services/HousesService'
import BaseController from '../utils/BaseController'

export class HousesController extends BaseController {
  constructor() {
    super('api/houses')
    this.router
      .get('', this.getAllHouses)
      .get('/:id', this.getHouseById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createHouse)
      .put('/:id', this.editHouse)
      .delete('/:id', this.deleteHouse)
  }

  async getAllHouses(req, res, next) {
    try {
      const houses = await housesService.getAllHouses()
      res.send(houses)
    } catch (error) {
      next(error)
    }
  }

  async getHouseById(req, res, next) {
    try {
      const house = await housesService.getHouseById(req.params.id)
      res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async createHouse(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id // set the creator Id on any create request to be that of the authenticated user's id
      const newHouse = await housesService.createHouse(req.body)
      res.send(newHouse)
    } catch (error) {
      next(error)
    }
  }

  async editHouse(req, res, next) {
    try {
      req.body.id = req.params.id // set the id of the edit request to... the id of ?? REVIEW
      const house = await housesService.editHouse(req.body)
      res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async deleteHouse(req, res, next) {
    try {
      const house = await housesService.deleteHouse(req.params.id, req.userInfo.id)
      // assinging a delete request to a constant seems to successful delete the req while also making Postman upset. Returned all the properties of the object appended to an OUT OF RANGE error code.
      res.send(house)
      res.send('House deleted')
    } catch (error) {
      next(error)
    }
  }
}
