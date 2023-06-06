const posts = require('./posts_new.json');

module.exports = async (req, res) => {
  const { PostID } = req.query;

  // Find the post with the matching PostID
  const post = posts.find((p) => p.postid === parseInt(PostID));

  if (post) {
    // Post found, send the response
    res.status(200).send(`
      <h1>${post.title}</h1>
      <img src="${post.metaValue}" alt="Post Image" />
    `);
  } else {
    // Post not found
    res.status(404).send('Post not found');
  }
};
