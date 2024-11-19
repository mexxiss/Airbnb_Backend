import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
  },
  images: {
    type: [String], // Array of image URLs or paths
    validate: {
      validator: function (images) {
        return images.length > 0; // At least one image is required
      },
      message: "At least one image is required.",
    },
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: [true, "Price per night is required"],
    min: [0, "Price per night must be a positive number"],
  },
  discount: {
    type: Number,
    default: 0, // Default no discount
    validate: {
      validator: function (value) {
        return value >= 0 && value <= 100; // Discount must be between 0 and 100
      },
      message: "Discount must be between 0% and 100%",
    },
  },
  finalPricePerNight: {
    type: Number,
    default: function () {
      return this.pricePerNight * (1 - this.discount / 100); // Automatically calculate final price
    },
  },

  guests: {
    type: Number,
    required: [true, "please enter guests"],
  },
  rooms: {
    type: Number,
    required: [true, "please enter rooms"],
  },
  beds: {
    type: Number,
    required: [true, "please enter beds"],
  },
  beds: {
    type: Number,
    required: [true, "please enter bathrooms"],
  },
  important_information: {
    type: String,
    required: [true, "please enter important_information"],
  },
  check_in: {
    type: String,
    required: [true, "please enter check_in"],
  },
  check_out: {
    type: String,
    required: [true, "please enter check_out"],
  },
  weekly_discount: {
    type: Number,
    required: [true, "please enter weekly_discount"],
  },
  monthly_discount: {
    type: Number,
    required: [true, "please enter monthly_discount"],
  },
  security_deposit: {
    type: Number,
    required: [true, "please enter security_deposit"],
  },
  price: {
    type: Number,
    required: [true, "please enter price"],
  },
  staying_rules: {
    type: String,
    required: [true, "please enter staying_rules"],
  },
  cleaning_fee: {
    type: Number,
    required: [true, "please enter cleaning_fee"],
  },
  vat_tex: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "texes",
  },
  tourism_tex: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "texes",
  },
  amenities: {
    amenitie_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "amenitie", // Reference to the User model
        required: true,
      },
    ], // Array of amenities (e.g., ['WiFi', 'Pool', 'Air Conditioning'])
    default: [],
  },
  availability: {
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > this.availability.startDate;
        },
        message: "End date must be after start date.",
      },
    },
  },
  host_by: {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
      required: true,
    },
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, "Average rating cannot be less than 0"],
      max: [5, "Average rating cannot be greater than 5"],
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        rating: {
          type: Number,
          required: true,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  location: {
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
        min: [-90, "Latitude must be between -90 and 90"],
        max: [90, "Latitude must be between -90 and 90"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
        min: [-180, "Longitude must be between -180 and 180"],
        max: [180, "Longitude must be between -180 and 180"],
      },
    },
  },
  staying_rules: {
    type: String,
  },
});

export const PropertyModel = model("property", propertySchema);
