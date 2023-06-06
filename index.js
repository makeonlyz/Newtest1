module.exports = async (req, res) => {
  const { PostID } = req.query;

  res.status(200).send(`
    <h1>Post ID: ${PostID}</h1>
  `);
};
