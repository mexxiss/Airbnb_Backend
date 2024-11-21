import { Schema, model } from "mongoose";

const HomeContentSchema = new Schema({
  banner_images: {
    type: [String],
    required: true,
  },
  what_people_says: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    facts: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
  },
  features: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      icon: {
        type: String,
      },
    },
  ],
  cleaning_maintenance: {
    what_inclued: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  interior_design_page: {
    description: String,
    what_inclued: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        others: {
          type: [String],
        },
      },
    ],
    how_it_works: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  listing_management: {
    title: String,
    description: String,
    what_inclued: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    how_it_works: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  management_support: {
    title: String,
    description: String,
    bottom_content: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
});

export const HomeContentModel = model("homeContent", HomeContentSchema);
