export default {
  jwtSecret:
    process.env.JWT_SECRET || 'uuas9spAVLUs36E27paU6J7awRLgXPCPFZ5de9or',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3333,
};
