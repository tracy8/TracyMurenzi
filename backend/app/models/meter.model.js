const mongoose = require("mongoose");
const Joi = require('joi')
var schema = mongoose.Schema(
  {
    code: String,
    owner_first_name: String,
    owner_last_name: String,
    power_expiration_time: Date
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Model = mongoose.model("meter", schema);

module.exports.Meter = Model;
module.exports.validateMeter = (body) => {
  return Joi.object({
    owner_first_name: Joi.string().required(),
    owner_last_name: Joi.string().required(),
  }).validate(body);
};
module.exports.validateLoadToken = (body) => {
    return Joi.object({
      token: Joi.string().required(),
      meter_number: Joi.string().min(6).required()
    }).validate(body);
  };
