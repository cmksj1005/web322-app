const Sequelize = require('sequelize');

var sequelize = new Sequelize(
  'qnwifpjw', // I should put this information in cyclic because it doesn't exist in github.
  'qnwifpjw',
  'vyOj3kIEdnNYpMZ6IXvMCRgyCgPABTqx',
  {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

//Is it possible to connect those two tables even though Post doesn't have category variable?
var Post = sequelize.define('Post', {
  PostId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

var Category = sequelize.define('Category', {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: 'category' });

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    //sequelize authenticate
    sequelize
      .sync()
      .then(() => {
        console.log(
          'Connection to the database has been established successfully.'
        );
        resolve();
      })
      .catch((error) => {
        console.error('Unable to sync the database:', error);
        reject(error);
      });
  });
};

module.exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    console.log('In getAllPosts');
    Post.findAll()
      .then((posts) => {
        if (posts) {
          console.log('In resolve in getAllPosts');
          resolve(posts); // Resolve with the array of posts if there are any
        } else {
          console.log('In reject in getAllPosts');
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.log('{message: ' + error + '}');
        reject('No results returned');
      });
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll().then((posts) => {
      const PublishedPosts = posts.filter(
        (eachPost) => eachPost.published == true
      );

      if (PublishedPosts.length > 0) {
        resolve(PublishedPosts); // Resolve with the array of posts if there are any
      } else {
        reject('No results returned');
      }
    });
  });
};

module.exports.getPublishedPostsByCategory = (inputCategory) => {
  return new Promise((resolve, reject) => {
    Post.findAll().then((posts) => {
      const PublishedPosts = posts.filter(
        (eachPost) =>
          eachPost.published == true && eachPost.category == inputCategory
      );

      if (PublishedPosts.length > 0) {
        resolve(PublishedPosts); // Resolve with the array of posts if there are any
      } else {
        reject('No results returned');
      }
    });
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((categories) => {
        if (categories) {
          console.log('return the categories successfully');
          resolve(categories); // Resolve with the array of category if there are any
        } else {
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.log('{message: ' + error + '}');
        reject('No results returned');
      });
  });
};

module.exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    postData.published = postData.published ? true : false;

    for (const eachData in postData) {
      if (`${postData[eachData]}` == '') {
        eachData[postData] = null;
      }
    }

    //check the body whether the name is right or not in addPost.hbs
    Post.create({
      body: postData.body,
      title: postData.title,
      postDate: currentDate,
      featureImage: postData.featureImage,
      published: postData.published,
    })
      .then(() => {
        resolve();
        console.log('A post is successfully created');
      })
      .catch((error) => {
        console.error('unable to create post:', error);
        reject(error);
      });
  });
};

module.exports.addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    if (categoryData == '') {
      categoryData = null;
    }
    if (categoryData) {
      console.log(categoryData);
      Category.create(categoryData)
        .then((result) => {
          console.log('A post is successfully created');
          resolve(result);
        })
        .catch((error) => {
          console.error('unable to create category: ' + error);
        });
    } else {
      reject(error);
    }
  });
};

module.exports.getPostsByCategory = (inputCategory) => {
  return new Promise((resolve, reject) => {
    Post.findAll().then((posts) => {
      const filteredCategory = posts.filter(
        (eachPost) => eachPost.category == inputCategory
      );

      if (filteredCategory.length > 0) {
        resolve(filteredCategory); // Resolve with the array of posts if there are any
      } else {
        reject('No results returned');
      }
    });
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const { gte } = Sequelize.Op;
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    }).then((filteredDate) => {
      if (filteredDate.length > 0) {
        resolve(filteredDate);
      } else {
        reject('No results returned');
      }
    });
  });
};

// Assuming you have the sequelize instance and the Post model already defined
module.exports.getPostById = (postId) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      //because of findAll
      where: { PostId: postId },
    })
      .then((data) => {
        if (data && data.length > 0) {
          //??with the data[0], ie: only provide the first object??
          resolve(data[0]); // Return only the first object if found
        } else {
          reject('No results returned'); // Reject with an error message if no data found
        }
      })
      .catch((error) => {
        reject(error.message); // Reject with the error message if an error occurs during the operation
      });
  });
};

module.exports.deleteCategoryById = (categoryId) => {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: { id: categoryId },
    })
      .then(() => {
        console.log('destroyed');
        resolve();
      })
      .catch((err) => {
        console.log('was rejected');
        reject(err);
      });
  });
};

module.exports.deletePostById = (postId) => {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: { PostId: postId },
    })
      .then(() => {
        console.log('destroyed');
        resolve();
      })
      .catch((err) => {
        console.log('was rejected');
        reject(err);
      });
  });
};
