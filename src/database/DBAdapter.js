class DBAdapter {
  async connect() {
    throw new Error('Method not implemented');
  }

  async disconnect() {
    throw new Error('Method not implemented');
  }

  getModel(name) {
    throw new Error('Method getModel() must be implemented by subclass');
  }

  async create(table, data) {
    throw new Error('Method not implemented');
  }

  async read(table, query) {
    throw new Error('Method not implemented');
  }

  async update(table, id, data) {
    throw new Error('Method not implemented');
  }

  async delete(table, id) {
    throw new Error('Method not implemented');
  }

  async batchCreate(table, items) {
    throw new Error('Method not implemented');
  }

  async batchUpdate(table, items) {
    throw new Error('Method not implemented');
  }

  async batchDelete(table, ids) {
    throw new Error('Method not implemented');
  }
}

export default DBAdapter;