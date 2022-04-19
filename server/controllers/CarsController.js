import { Auth0Provider } from '@bcwdev/auth0provider'
import { carsService } from '../services/CarsService'
import BaseController from '../utils/BaseController'

export class CarsController extends BaseController {
  constructor() {
    super('api/cars') // this calls to the basecontroller class | super calls on a parent
    this.router // the router creates a 'route' of html that Express uses to make a call containing the super^
      .get('', this.getAll)
      .get('/:id', this.getCarById)
      // beyond this point, a user must be logged in to access this method
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createCar)
      .put('/:id', this.editCar)
      .delete('/:id', this.deleteCar)
  }

  async getAll(req, res, next) {
    try {
      const cars = await carsService.getAllCars()
      res.send(cars)
    } catch (error) {
      next(error)
    }
  }

  async getCarById(req, res, next) {
    try {
      const car = await carsService.getCarById(req.params.id)
      res.send(car)
    } catch (error) {
      next(error)
    }
  }

  async createCar(req, res, next) {
    try {
      // never trust client body to tell you who they are, trust authentication service
      req.body.creatorId = req.userInfo.id // the creator of the post is matched to the authorization token in userinfo
      const car = await carsService.createCar(req.body)
      return res.send(car)
    } catch (error) {
      next(error)
    }
  }

  async editCar(req, res, next) {
    try {
      req.body.id = req.params.id
      const car = await carsService.editCar(req.body)
      return res.send(car)
    } catch (error) {
      next(error)
    }
  }

  async deleteCar(req, res, next) {
    try {
      const car = await carsService.deleteCar(req.params.id, req.userInfo.id)
      res.send(car)
    } catch (error) {
      next(error)
    }
  }
}
