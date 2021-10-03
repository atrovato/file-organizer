import dotenv from 'dotenv';
dotenv.config();

const { API_URL, WSS_URL } = process.env;
import { DefinePlugin } from 'webpack';

export default {
  webpack(config) {
    config.plugins.push(
      new DefinePlugin({
        'process.env.API_URL': JSON.stringify(API_URL),
        'process.env.WSS_URL': JSON.stringify(WSS_URL),
      })
    );
  }
};
