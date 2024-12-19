import swaggerAutogen from 'swagger-autogen';

// Swagger documentation config
const doc = {
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "For Airbnb Management Platform",
  },
  host: 'localhost:8000',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    parameters: {
      LimitParameter: {
        in: "query",
        name: "limit",
        required: false,
        type: "number",
        description: "Number of users per page",
      },
      PageParameter: {
        in: "query",
        name: "page",
        required: false,
        type: "number",
        description: "Page number for pagination",
      },
      IdParameter: {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
          description: "Unique identifier for the resource",
        },
        description: "The ID of the resource to retrieve or modify",
      },
      UserParameter: {
        in: "path",
        name: "user",
        required: true,
        schema: {
          type: "string",
          description: "Unique identifier for the resource",
        },
        description: "The ID of the resource to retrieve or modify",
      }
    },
    schemas: {
      SignUpRequest: {
        first_name: 'John',
        last_name: 'Doe',
        email: ['john.doe@example.com', 'abc@xyz.com'],
        phone: ['+919876543210'],
        role: 'Owner',
        address: {
          building_no: "123",
          city: "Springfield",
          street: "Main Street",
          area: "Downtown",
          landmark: "Near City Mall",
          country: "Dubai",
          pincode: "123456"
        }
      },
      UpdatesRequest: {
        updates: {
          abc_updated_key: "xyz_updated_value"
        }
      },
      TaxUtilityRequest: {
        vat_tax_rate: 5,
        tourism_tax_rate: 6
      },
      MaintenanceRequest: {
        issue: "date_of_issue",
        status: "Pending/In Progress/Resolved",
        cost: 1234.5,
        property: "object_id of property being maintained"
      },
      GallaryRequest: {
        img_url: "cloudinary image url",
        type: "gallary_type_object_id"
      },
      ProvidersRequest: {
        internet: {
          service_providers: [{ name: "service_provider_name" }]
        },
        electricity_water: {
          service_providers: [{ name: "service_provider_name" }]
        },
        gas: {
          service_providers: [{ name: "service_provider_name" }]
        },
        chiller: {
          service_providers: [{ name: "service_provider_name" }]
        },
        other: {
          service_providers: [{ name: "service_provider_name" }]
        }
      },
      AirbnbDubaiRequest: {
        section1: { title: "section1_title", body: "section1_body" },
        section2: { title: "section2_title", body: "section2_body", image: "section2_image_url", text_direction: "left/right/center" },
        section3: { title: "section3_title", points: [{ title: "section3_point_title", body: "section3_point_body" }] },
        section4: { title: "section4_title", body: "section4_html_body", image: "section4_image_url", text_direction: "left/right/center" },
        section5: { title: "section5_title", images: ["section5_images_url"] }
      },
      PropertiesRequest: {
        title: "title_of_property",
        description: "description_of_property",
        property_images: ["objectIds_from_gallery_collection"],
        property_details: {
          max_guest_count: 3,
          rooms_count: 3,
          beds_count: 3,
          bathrooms_count: 1,
          furnishing: "Premium/Standard",
          wifi: {name: "property_wifi_name", password: "property_wifi_password"},
          permit: {permit_code: "property_permit_code", permit_expiry_date: "property_permit_expiry_date"},
          parking_no: "property_parking_no"
        },
        address: {
          building_no: "property_building_no",
          city: "property_city",
          street: "address_street",
          area: "address_area",
          landmark: "address_nearby_landmark",
          pincode: "address_pincode",
          country: "address_country"
        },
        discounts_percentage: { weekly: 5, monthly: 20 },
        costs: {
          currency: "AED",
          security_details: "The damage deposit will be taken at arrival and returned 7-14 days after chekout, subject to a damage inspection of the property.",
          prices: { security_amount: 2000, price_per_night: 1000, cleaning_fee: 330},
        },
        property_check_details: { check_in: "15:00", check_out: "11:00"},
        staying_rules: ["Please don't forget to send your passport/valid ID as well as those checking in with you. This is a strict requirement of Dubai's Economy and Tourism Department (DET)"],
        cancellation_policy: "You can cancel the reservation free of charge until 14 days before arrival. The total reservation price will be charged if you cancel within 14 days of arrival.",
        amenities: ["objectIds_from_amenities_collection"],
        important_information: {
          about_space: "About_property_space",
          guest_access: "property_guest_access",
          getting_around: "property_getting_around",
          other: "property_other_info"
        },
        user: "objectId_of_property_owner_from_user_collection",
        status: "Active/Inactive"
      },
      FaqsRequest: {
        question: "faq_question",
        answer: "faq_answer",
        page: ["page_route_mapping_value"]
      },
      FeaturedArticlesRequest: {
        third_party: "ObjectId to Third Party Logos",
        headline: "headline_of_featured_article", 
        added_on: "date_when_featured", 
        link: "link_to_featured_articleS"
      },
      VideoGuidesRequest: {
        video_url: "cloudinary_url_of_video", 
        title: "Title_of_Video_Guide", 
        thumbnail: "thumbnail_image_for_video"
      },
      HomeContentRequest: {
        banner_images: ["image_urls_for_home_banners"],
        what_people_says: {
          title: "title_for_section_what_people_says",
          description: "description_for_section_what_people_says",
          facts: [{
            icon: "cloudinary_icon_url",
            title: "fact_title",
            description: "fact_description"
          }]
        },
        features: [{
          icon: "cloudinary_icon_url",
          title: "features_title",
          description: "features_description"
        }],
        cleaning_maintenance: {
          what_inclued: [{title: "title_text", description: "description_text"}]
        },
        interior_design_page: {
          description: "description_for_interior_design_page",
          what_inclued: [{title: "title_text", description: "description_text", others: ["other_points"]}]
        },
        listing_management: {
          title: "title_for_listing_management",
          description: "description_for_listing_management",
          what_inclued: [{title: "title_text", description: "description_text"}]
        },
        management_support: {
          title: "title_for_management_support",
          description: "description_for_management_support",
          bottom_content: [{title: "title_text", description: "description_text"}]
        }
      },
      LegalsRequest: {
        body: "html_body_for_legals", 
        title: "Terms & Conditions/Privacy Policy/Refund Policy"
      },
      PricingsRequest: {
        title: "pricing_title - On-Boarding",
        description: "pricing_description", 
        figures: "pricing_figures - Free/17%", 
        icon: "pricing_cloudinary_icon_url", 
        offers: ["pricing_plan_offers"]
      }
    }
  },
  basePath: '/api/v1',
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Users",
      description: "User management routes",
    },
    {
      name: "Admin",
      description: "Admin-related routes",
    },
    {
      name: "General",
      description: "Other general routes",
    },
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate Swagger documentation
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);