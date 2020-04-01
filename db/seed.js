const chance = require('chance').Chance();
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

module.exports = async({ usersToCreate = 5, postsToCreate = 5 } = {}) => {
  const loggedInUser = await User.create({
    username: 'test@test.com',
    password: 'password',
    profilePhotoUrl: 'placekitten'
  });

  const users = await User.create([...Array(usersToCreate)].slice(1).map(() => ({
    username: chance.animal(),
    passwordHash: chance.animal(),
    profilePhotoUrl: chance.animal()
  })));

  await Post.create([...Array(postsToCreate)].map(() => ({
    user: chance.pickone(users)._id,
    photoUrl: chance.animal(),
    caption: chance.animal(),
    tags: [chance.animal()]
  })));
};
