import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const PropertiesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    property_images: {
        type: [Schema.Types.ObjectId],
        ref: "gallery",
        required: true,
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.every(val => mongoose.Types.ObjectId.isValid(val));;
            },
            message: "At least one image is required for the property.",
        },
    },
    property_details: {
        furnishing: {
            type: String,
            enum: ["Premium", "Standard"],
            default: "Standard"
        },
        max_guest_count: {
            type: Number,
            min: 1,
            max: 20
        },
        rooms_count: {
            type: Number,
            min: 1
        },
        beds_count: {
            type: Number,
            min: 1
        },
        bathrooms_count: {
            type: Number,
            min: 1
        },
        permit: {
            permit_code: {type: String},
            permit_expiry_date: {type: String}
        },
        wifi: {
            name: {type: String},
            password: {type: String}
        },
        utilities: [{
            name: String,
            account_no: String,
            paid_by: String,
            web_login: String,
            web_pass: String,
            link: String,
            uploads: [String]
        }]
    },
    address: {
        building_no: {
            type: String
        },
        city: {
            type: String,
        },
        street: {
            type: String
        },
        area: {
            type: String,
        },
        landmark: {
            type: String,
        },
        country: {
            type: String,
            default: "Dubai",
        },
        pincode: {
            type: String
        }
    },
    discounts_percentage: {
        weekly: {
            type: Number,
            default: 0
        },
        monthly: {
            type: Number,
            default: 0
        }
    },
    costs: {
        type: {
            currency: {
                type: String,
                required: true,
                default: "AED"
            },
            security_details: {
                type: String,
                default: "The damage deposit will be taken at arrival and returned 7-14 days after chekout, subject to a damage inspection of the property."
            },
            prices: {
                security_amount: {
                    type: Number,
                    default: 0
                },
                price_per_night: {
                    type: Number,
                    required: true
                },
                cleaning_fee: {
                    type: Number,
                    required: true,
                    default: 0
                }
            },
        }
    },
    property_check_details: {
        check_in: {
            type: String,
            required: true,
        },
        check_out: {
            type: String,
            required: true
        }
    },
    staying_rules: {
        type: [String],
        default: ["Please don't forget to send your passport/valid ID as well as those checking in with you. This is a strict requirement of Dubai's Economy and Tourism Department (DET)"]
    },
    cancellation_policy: {
        type: String,
        default: "You can cancel the reservation free of charge until 14 days before arrival. The total reservation price will be charged if you cancel within 14 days of arrival."
    },
    amenities: {
        type: [Schema.Types.ObjectId],
        ref: "amenities",
        required: true,
        default: []
    },
    important_information: {
        about_space: {
            type: String,
        },
        guest_access: {
            type: String
        },
        getting_around: {
            type: String
        },
        other: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active", 
    },
}, { timestamps: true });

PropertiesSchema.methods.calculateCosts = async function (nights_count, discount = 0, vat_tax_rate, tourism_tax_rate) {
    const stay_charges = this.costs.prices.price_per_night * nights_count;
    const cleaning_fee = this.costs.prices.cleaning_fee;
    const vat_tax = stay_charges * (vat_tax_rate / 100);
    const tourism_tax = stay_charges * (tourism_tax_rate / 100);

    if (nights_count >= 30) {
        discount += stay_charges * (this.discounts_percentage.monthly / 100);
    } else if (nights_count >= 7) {
        discount += stay_charges * (this.discounts_percentage.weekly / 100);
    }
    const net_charges = stay_charges + cleaning_fee + vat_tax + tourism_tax - discount;
    const costs = { stay_charges, discount, cleaning_fee, tourism_tax, vat_tax, net_charges };
    return costs;
};


PropertiesSchema.methods.addStayingRules = async function (newRules) {
    if (Array.isArray(newRules) && newRules.length > 0) {
        this.staying_rules = [...newRules, ...this.staying_rules];
    }
    await this.save();
};

PropertiesSchema.statics.getPropertyById = async function (id) {
    return await this.findById(id).populate('amenities').populate('property_images');
};

PropertiesSchema.methods.addAmenities = async function (newAmenities) {
    this.amenities.push(...newAmenities);
    await this.save();
};

PropertiesSchema.methods.updateImages = async function (newImages) {
    this.property_images = [...newImages];
    await this.save();
};

export const PropertiesModel = model("properties", PropertiesSchema)