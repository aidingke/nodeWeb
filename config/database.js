if(process.env.NODE_ENV=="production"){
	module.exports = 
	{
		mongoURL:"mongodb://mister:1234@ds139715.mlab.com:39715/node-app-prod"
	}
}else{
	module.exports = {mongoURL:"mongodb://localhost/mydbs"}
}