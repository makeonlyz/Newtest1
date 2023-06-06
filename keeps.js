const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const postsFile = 'posts.json';
const postmetaFile = 'wp_postmeta.csv';
const outputFile = 'posts_new.json';

async function matchFeaturedImage() {
  try {
    // Read posts.json
    const postsData = fs.readFileSync(postsFile);
    const posts = JSON.parse(postsData);

    // Read wp_postmeta.csv and create a mapping of post_id to meta_value
    const postmetaMap = {};
    fs.createReadStream(postmetaFile)
      .pipe(csv())
      .on('data', (data) => {
        const { post_id, meta_key, meta_value } = data;
        if (meta_key === '_wp_attached_file') {
          postmetaMap[post_id] = meta_value;
        }
      })
      .on('end', () => {
        // Match featuredImageId in posts.json with post_id in postmetaMap
        const matchedPosts = posts.map((post) => {
          const featuredImageId = post.featuredImageId;
          const metaValue = postmetaMap[featuredImageId];
          const modifiedMetaValue = `https://siamsay.com/wp-content/uploads/${metaValue}`;
          return { ...post, metaValue: modifiedMetaValue };
        });

        // Save matched posts to posts_new.json
        fs.writeFileSync(outputFile, JSON.stringify(matchedPosts, null, 2));
        console.log('Matched posts saved to posts_new.json file.');
      });

  } catch (error) {
    console.error('Error matching featured images:', error);
  }
}

matchFeaturedImage();
