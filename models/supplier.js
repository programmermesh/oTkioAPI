const Joi = require('joi');
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const SupplierSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    email: {
        type: String,
        minlength: 3,
        trim: true
    },
    country: {
        type: String,
        minlength: 3
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    main_contact: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'SupplierCategory',
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {
    timestamps: true
})

const Supplier = model('Supplier', SupplierSchema);

function validateSupplier(supplier) {
    const schema = Joi.object({
        email: Joi.string().min(3).email().required().label('Email'),
        country: Joi.string().required().label('Country'),
        category: Joi.string().required().label("Category"),
        tags: Joi.array().items(Joi.string()).required().label(" Tags of the user"),
        status: Joi.boolean().optional().label('Status')
    });

    return schema.validate(supplier);
}

exports.Supplier = Supplier;
exports.validateSupplier = validateSupplier;