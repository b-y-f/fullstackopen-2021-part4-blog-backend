const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item)=>{
    return sum + item.likes;
  };
  return blogs.reduce(reducer, 0);
};

// 4.6
var _ = require('lodash');
const mostBlogs = (blogs) =>{

  const result = _(blogs)
    .groupBy('author')
    .flatMap((item)=>{
      const obj = _.countBy(item, 'author')
      return _.map(obj,(k,v)=>({author:v,blogs:k}))
      })
    .value()

  

  return _.maxBy(result,'blogs')
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
};
