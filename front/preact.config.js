import dotenv from 'dotenv';
dotenv.config();

const { API_URL } = process.env;
import { DefinePlugin } from 'webpack';

export default {
  webpack(config) {
    config.plugins.push(
      new DefinePlugin({
        'process.env.API_URL': JSON.stringify(API_URL),
      })
    );
  }
};
