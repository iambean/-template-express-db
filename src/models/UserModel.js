export default class UserModel {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  create(data) {
    return this.dbAdapter.getModel('User').create(data);
  }

  read(filter) {
    return this.dbAdapter.getModel('User').findAll({ where: filter });
  }

  update(id, data) {
    return this.dbAdapter.getModel('User').update(data, { where: { id } });
  }

  delete(id) {
    return this.dbAdapter.getModel('User').destroy({ where: { id } });
  }
}