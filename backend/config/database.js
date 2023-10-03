const path = require('path');

module.exports = ({ env }) => {
  console.log("Db path");
  console.log(env('DATABASE_FILENAME', path.join(__dirname, '..', '.tmp/data.db')));
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', path.join(__dirname, '..', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  }
};
