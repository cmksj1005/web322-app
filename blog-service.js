const fs = require('fs');
let categories = [];
let posts = [];

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/posts.json', 'utf-8', (err, data) => {
      if (err) {
        reject('unable to read file');
      }
      posts = JSON.parse(data);
      fs.readFile('./data/categories.json', 'utf-8', (err, data) => {
        if (err) {
          reject('unable to read file');
        }
        categories = JSON.parse(data);
        resolve('unable to read file');
      });
    });
  });
};

module.exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length == 0) {
      reject('no results returned');
    }
    resolve(posts);
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length == 0) {
      reject('no results returned');
    }
    const filteredPosts = posts.filter((post) => post.published == true);
    resolve(filteredPosts);
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    if (posts.length == 0) {
      reject('no results returned');
    }
    const filteredPosts = posts.filter(
      (post) => post.published == true && post.category == category
    );
    resolve(filteredPosts);
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length == 0) {
      reject('no results returned');
    }
    resolve(categories);
  });
};

module.exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    if (postData) {
      postData.id = posts.length + 1;
      postData.postDate = formatDate(new Date());
      if (postData.published) {
        postData.published = 'true';
      } else {
        postData.published = 'false';
      }
      posts.push(postData);
      resolve('success');
    } else {
      reject('failed');
    }
  });
};

// Helper function to format the date as "YYYY-MM-DD" or "YYYY-M-D"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

module.exports.getPostsByCategory = (inputCategory) => {
  return new Promise((resolve, reject) => {
    const filteredCategory = posts.filter(
      (eachPost) => eachPost.category == inputCategory
    );
    if (filteredCategory.length > 0) {
      resolve(filteredCategory);
    } else {
      reject('No results returned');
    }
  });
};

module.exports.getPostsByMinDate = (inputMinDate) => {
  return new Promise((resolve, reject) => {
    const filteredDate = posts.filter(
      (post) => new Date(post.postDate) >= new Date(inputMinDate)
    );

    if (filteredDate.length > 0) {
      resolve(filteredDate);
    } else {
      reject('No results returned');
    }
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const foundPost = posts.find((post) => post.id == id);

    if (foundPost) {
      resolve(foundPost);
    } else {
      reject('No result returned');
    }
  });
};
