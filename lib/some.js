'use strict';

const some = (fn, args) => (
  new Promise((resolve, reject) => {
    const len = args.length;
    let i = 0;
    
    /*
      callback for fn
      takes 
        - err
        - res - bool value, means if val is suitable for fn
    */
    const callback = (err, res) => {
      if (res) resolve(true);
      if (err) reject(err);
      i++;
      iterate();
    };

    const iterate = () => {
      if (i === len) resolve(false);
      else fn(args[i], callback);
    };

    iterate();
  })
);

module.exports = some;