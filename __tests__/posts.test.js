const { getAgent, getUser, getPost } = require('../db/data-helpers');

describe('post routes', () => {
  it('creates a post', async() => {
    const user = await getUser({ email: 'test@test.com' });

    return getAgent()
      .post('/api/v1/posts')
      .send({
        photoUrl: 'placekitten',
        caption: 'this sucks',
        tags: ['these are tags']
      })
      .then(res => {
        expect(res.user).toEqual({
          _id: expect.any(String),
          user: user._id,
          photoUrl: 'this sucks',
          caption: 'this sucks',
          tags: ['these are tags'],
          __v: 0
        });
      });
  });

  it('updates a post', async() => {
    const user = await getUser({ email: 'test@test.com' });
    const post = await getPost({ user: user._id });

    return getAgent()
      .patch('/api/v1/posts/${post._id}')
      .send({ caption: 'this rocks' })
      .then(res => {
        expect(res.body).toEqual({
          ...post,
          caption: 'this rocks'
        });
      });
  });

  it('deletes a post', async() => {
    const user = await getUser({ email: 'test@test.com' });
    const post = await getPost({ user: user._id });

    return getAgent()
      .delete('/api/v1/posts/${post._id}')
      .then(res => {
        expect(res.body).toEqual(post);
      });
  });


});
