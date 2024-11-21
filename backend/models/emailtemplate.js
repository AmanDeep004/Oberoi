const mongoose = require('mongoose');

const emails = new mongoose.Schema(
	{
		templateTitle: {
			type: String
		},
		subject: {
			type: String
		},
		displayName: {
			type: String,
			default:'Vosmos Metacommerce'
		},
		emailContent: {
			type: String
		},
        isActive:{
			type:Boolean,
            default:false
		}
	},
	{
		timestamps: true
	}
);

const EmailsTemplates = mongoose.model('EmailsTemplates', emails);

module.exports = EmailsTemplates;
