const Joi = require('joi');

function functionToSchema(func) {
  const schema = Joi.object({
    searchQuery: Joi.string().required(),
  });

  return {
    name: func.name,
    schema,
  };
}

module.exports = {
  functionToSchema,
};

