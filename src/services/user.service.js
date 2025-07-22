export default class UserService {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  getModel() {
    return this.dbAdapter.getModel('User');
  }

  async create(data) {
    const user = await this.getModel().create(data);
    return user;
  }

  async read(filter) {
    const users = await this.getModel().findAll({ where: filter });
    return users;
  }

  async update(id, data) {
    const result = await this.getModel().update(data, { where: { id } });
    return result;
  }

  async delete(id) {
    const result = await this.getModel().destroy({ where: { id } });
    return result; 
  }
}