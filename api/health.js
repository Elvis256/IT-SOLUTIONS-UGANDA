module.exports = async (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'IT Solutions Uganda API is running'
  });
};
