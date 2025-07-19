export default class UserModel {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  getModel() {
    return this.dbAdapter.getModel('User');
  }

  create(data) {
    return this.getModel().create(data);
  }

  read(filter) {
    return this.getModel().findAll({ where: filter });
  }

  update(id, data) {
    return this.getModel().update(data, { where: { id } });
  }

  delete(id) {
    return this.getModel().destroy({ where: { id } });
  }
}