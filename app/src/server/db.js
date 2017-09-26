/* eslint new-cap: 0 */

import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vizapp');

const itemSchema = Schema({
  parents: Array,
  children: Array,
});

const linkSchema = Schema({
  topId: Schema.Types.ObjectId,
  day: Number,
  type: Number,
});

export const ItemModel = mongoose.model('Item', itemSchema);
export const LinkModel = mongoose.model('Link', linkSchema);
export const db = mongoose.connection;
