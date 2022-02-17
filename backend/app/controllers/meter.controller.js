const db = require("../models");

const {
  validateMeter,
  Meter,
  validateLoadToken,
} = require("../models/meter.model");
const { Token } = require("../models/token.model");
const {
  generateMeterNumber,
  getDaysDifference,
  validateUUID,
  getTokenExpirationDate,
} = require("../utils/imports");

// Create and Save a new Meter
exports.create = (req, res) => {
  // Validate request
  const { error } = validateMeter(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  // Save Meter in the database
  Meter.create({
    code: generateMeterNumber(),
    owner_first_name: req.body.owner_first_name,
    owner_last_name: req.body.owner_last_name,
  })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Meter.",
      });
    });
};

// Load token
exports.loadToken = async (req, res) => {
  // Validate request
  const { error } = validateLoadToken(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }
  if (!validateUUID(req.body.token))
    return res.status(400).send({ message: "invalid token" });

  const meter = await Meter.findOne({ code: req.body.meter_number });
  if (!meter) return res.status(404).send({ message: "meter not found" });

  const token = await Token.findOne({
    meter_number: req.body.meter_number,
    code: req.body.token,
  });
  if (token.status == "used")
    return res.status(400).send({ message: "token already used" });

  Token.findOneAndUpdate(
    {
      code: req.body.token,
      meter_number: req.body.meter_number,
      status: "unused",
    },
    { status: "used" },
    {
      useFindAndModify: false,
    }
  )
    .then(async (data) => {
      if (!data) {
        res.status(404).send({
          message: "Token Not Found",
        });
        // add the duration count
      } else {
        await Meter.updateOne(
          { _id: meter._id },
          {
            power_expiration_time: getTokenExpirationDate(
              data.total_amount,
              meter.power_expiration_time
            ),
          }
        );

        const daysBefore = meter.power_expiration_time
            ? getDaysDifference(meter.power_expiration_time)
            : 0,
          added = data.total_amount / 100;

        res.send({
          message: `${added} days added, now you have ${
            daysBefore + added
          } days remanining`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Find a single Meter by meter_number
exports.findOne = (req, res) => {
  const number = req.params.number;

  Meter.findOne({ code: number })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Not found Meter with number " + number,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Meter with number=" + number,
      });
    });
};

// Find a single Meter by meter_number
exports.getMeterDetails = (req, res) => {
    const number = req.params.number;
  
    Meter.findOne({ code: number })
      .then((data) => {
        if (!data)
          res.status(404).send({
            message: "Not found Meter with number " + number,
          });
        else return res.send({message: `You have ${getDaysDifference(data.power_expiration_time)} days remaning`});
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Meter with number=" + number,
        });
      });
  };

// Update a Meter by the meter_number in the request
exports.update = (req, res) => {
  // Validate request
  const { error } = validateMeter(req.body);
  if (error) {
    res.status(400).send({ message: error.deatails[0].message });
    return;
  }

  const number = req.params.number;

  Meter.findOneAndUpdate({ code: number }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Not Found",
        });
      } else res.send({ message: "Meter was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Meter with number=" + number,
      });
    });
};

// Delete a Meter with the specified id in the request
exports.delete = (req, res) => {
  const number = req.params.number;

  Meter.findOneAndDelete({ code: number }, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Meter with id=${id}. Maybe Meter was not found!`,
        });
      } else {
        res.send({
          message: "Meter was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Meter with number=" + number,
      });
    });
};
