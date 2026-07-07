const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(

  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
  onPageScore: {
    type: Number,
    default: 0,
  },

  technicalScore: {
    type: Number,
    default: 0,
  },

  performanceScore: {
    type: Number,
    default: 0,
  },

  contentScore: {
    type: Number,
    default: 0,
  },

  overallScore: {
    type: Number,
    default: 0,
  },

  grade: {
    type: String,
    default: "F",
  },

  completedAt: {
    type: Date,
    default: Date.now,
  },

  executionTime: {
    type: Number,
    default: 0,
  },
},

    crawler: {
      type:mongoose.Schema.Types.Mixed,
      default: {},
    },

    onPage: {
      type: Object,
      default: {},
    },

    technical: {
      type: Object,
      default: {},
    },

    performance: {
      type: Object,
      default: {},
    },

    content: {
      type: Object,
      default: {},
    },

    recommendations: {
      type: [Object],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Report", reportSchema);