const chance = require('chance')();

class User {
  static get name() {
    return 'user';
  }

  constructor(options) {
    Object.assign(this, options);
  }

  toApiModel() {
    return {
      id: this.id,
      email: this.email,
    };
  }
}

async function build() {
  return {
    id: chance.template('{AA#####'),
    email: chance.email(),
  };
}

module.exports = {
  model: User,
  name: 'user',
  build,
};
