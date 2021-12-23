const Joi = require("joi");
const user = require("./user.js");
const mongoose = require("mongoose");

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    project_name: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
    },
    project_reference_number: {
      type: String,
    },
    project_manager: {
      type: String,
    },
    business_unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business_Unit",
    },
    unit: {
      type: String,
    },
    department: {
      type: String,
    },
    currency: {
      type: String,
    },
    project_status: {
      type: String,
    },
    image: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          role: { type: String },
        },
      ],
    },
    budgets: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] },
  })
);

function validateProject(project) {
  const schema = Joi.object({
    project_name: Joi.string().required().label("Project Name"),
    startDate: Joi.string().required().label("Start Date"),
    endDate: Joi.string().required().label("End Date"),
    location: Joi.string().required().label("Location"),
    description: Joi.string().required().label("Description"),
    project_reference_number: Joi.string()
      .required()
      .label("Project Reference Number"),
    project_manager: Joi.string().required().label("Project Manager"),
    business_unit: Joi.string().required().label("Business Unit"),
    unit: Joi.string().required().label("Unit"),
    department: Joi.string().required().label("Department"),
    currency: Joi.string().required().label("Currency"),
    project_status: Joi.string().required().label("Project Status"),
    companyId: Joi.string().required().label("CompanyId"),
    image: Joi.string().label("Image"),
    createdBy: Joi.string().required().label("createdBy"),
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validateProject = validateProject;
