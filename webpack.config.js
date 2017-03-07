var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
	context: __dirname,
	devServer:{
		hot: true,
		port: 3000,
		host: 'localhost',
		// historyApiFallback: true,
		// noInfo: false,
		// stats: 'minimal',
		contentBase: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	entry: {
		share: './src/js/share.js',
		//share.react: './src/js/share.share.jsx'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		//[name]  [hash]  [chunkhash]
		//filename:'js/[name]-[hash].js',
		filename:'js/[name].js',
		publicPath: '/'
	},
	resolveLoader:{
		moduleExtensions :['-loader']
	},
	module: {
		rules: [
			// {
			// 	test:/\.js[x]?$/,
			// 	include: path.resolve(__dirname, "src"),
			// 	exclude: path.resolve(__dirname, "node_modules"),
			// 	loader: 'babel',
			// 	options: {
			// 		presets:['react',['es2015', {"modules": false}]]
			// 	}
			// },
			{
				test:/\.less$/,
				include: path.resolve(__dirname, "src/style"),
				use: ['style', 'css', {
						loader: 'postcss',
						options: {
							plugins: function () {
								return [
									autoprefixer({
										browsers : ['last 5 versions']
									})
								];
							}
						}
					}, 'less']
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				include: path.resolve(__dirname, "src/img"),
				use: ['url?limit=20000']
			}
		]
	},
}