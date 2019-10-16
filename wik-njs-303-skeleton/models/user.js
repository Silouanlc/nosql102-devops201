const table_user = 'user:';
const possibleKeys = [ 'firstname', 'lastname', 'email', 'pseudo', 'password' ];
const uuidv4 = require('uuid/v4');
const Redis = require('ioredis')
const env = process.env
const redis = new Redis(parseInt(env.REDIS_PORT) || 6379, env.REDIS_HOST || 'localhost')

module.exports = {
	get: (userId) => {
		return (
			redis
				.hgetall(table_user + userId)
				.then((resolve) => {
					return resolve;
				})
				.catch((reject) => {
					console.log(new Error(reject));
				})
		);
	},

	count: () => {
		var stream = redis.scanStream({ match: 'user:*', count: 10000 });
		return new Promise(function(resolve, reject) {
			stream.on('data', (resultkey) => {
				console.log('count = ' + resultkey.length);
				resolve(resultkey.length);
			});
		});
	},
    
    
    
    
    
    
	getAll: (limit, offset) => {
		let response = [];
		var stream = redis.scanStream({ match: 'user:*', count: limit === undefined ? 10000 : limit });
		return new Promise(function(resolve, reject) {
			stream.on('data', (resultkey) => {
				Promise.all(
					resultkey.map(async (element) => {
						return new Promise(function(resolve, reject) {
							let UserId = element.split(':')[1];
							let object1 = { rowid: UserId };
							resolve(
								redis.hgetall(table_user + UserId).then((resolve) => {
									response.push(Object.assign(object1, resolve));
								})
							);
						});
					})
				).then((_resovle) => {
					resolve(response);
				});
			});
		});
	},
    
    

	insert: (params) => {
		let UserId = uuidv4();
		console.log(UserId);
		return redis
			.hmset(table_user + UserId, params)
			.then((resolve) => {
				return resolve;
			})
			.catch((reject) => {
				console.log(new Error(reject));
			});
	},
    
    

	update: async(userId, params) => {
    await redis.hmset('user:' + userId + '', {
      pseudo:  params.pseudo,
      firstname: params.firstname,
      lastname: params.lastname,
      email: params.email,
      password: params.password
    })
,
    
    remove: (userId) => {
		return redis
			.del(table_user + userId)
			.then((resolve) => {
				return resolve;
			})
			.catch((reject) => {
				console.log(new Error(reject));
			});
    }

	
};
