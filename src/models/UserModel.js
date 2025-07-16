export default class UserModel {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  create(data) {
    return this.dbAdapter.getModel('User').create(data);    
  }

  read(filter) {
    return this.dbAdapter.read('User', filter);
  }

  update(id, data) {
    return this.dbAdapter.update('User', id, data);
  }

  delete(id) {
    return this.dbAdapter.delete('User', id);
  }
}