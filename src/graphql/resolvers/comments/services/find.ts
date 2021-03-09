import Comments from '../../../../entities/Comments';

const findComments = async (postID: string, offset: number) => {
  const comments = await Comments.findOne({ post: postID })
    .where('comments')
    .slice([offset, offset + 3])
    .populate('comments.author');

  if (!comments) {
    throw new Error();
  }

  if (comments.comments) {
    return comments?.comments;
  }

  return [];
};

export default findComments;
