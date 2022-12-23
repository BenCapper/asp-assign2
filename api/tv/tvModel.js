import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const TvSchema = new Schema({
  backdrop_path: { type: String },
  favorite: { type: Boolean },
  genre_ids: [{ type: Number }],
  id: { type: Number, required: true, unique: true },
  mustWatch: { type: Boolean },
  name: { type: String },
  origin_country: [{ type: String }],
  original_language: { type: String },
  original_name: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  vote_average: { type: Number },
  vote_count: { type: Number },

});

TvSchema.statics.findByTvDBId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Tv', TvSchema);