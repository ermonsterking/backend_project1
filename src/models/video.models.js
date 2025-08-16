import mongoose, {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{
            type: String ,//cloudnary
            required: [true, "it is must"]
        },
        thumbnail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: 
            {
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        IsPublished: {
            type: Boolean,
            default: true

        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }


    },

    
    {
        timestamps: true
        
    }
)
videoSchema.plugins(mongooseAggregatePaginate)


export const Video = mongoose.model("Video",videoSchema)






