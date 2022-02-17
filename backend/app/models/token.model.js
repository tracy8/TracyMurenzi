const mongoose = require("mongoose");
const Joi = require("joi");
var schema = mongoose.Schema(
  {
    code: String,
    meter_number: { type: String, ref: "meter" },
    total_amount: Number,
    endDate: Date,
    status: {
      type: String,
      enum: ["unused", "used"],
    },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Model = mongoose.model("token", schema);

module.exports.Token = Model;
module.exports.validateTokenPayload = (body) => {
  return Joi.object({
    total_amount: Joi.number().min(100).max(182500).required(),
    meter_number: Joi.string().min(6).required(),
  }).validate(body);
};
