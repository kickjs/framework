'use strict';

const _         = require( 'lodash' );
const Registrar = require( 'kick-ioc/Registrar' );


Registrar
    .constant( 'env', {
        mode: 'development',
        paths: {
            app: __dirname + '/app',
            config: __dirname + '/config'
        }
    } )
    .register(
        require( './src/App/ConfigProvider' ),
        require( './src/Koa/KoaProvider' ),
        require( './src/Router/RouterProvider' ),
        require( './src/Server/ServerProvider' )
    )
    .resolve( function *() {

        let server = yield this.use( 'server' );
        let config = yield this.use( 'config' );

        server.start();

        console.log( 'server.start();' );
        console.log( config.get( 'app' ) );

    } )
    .catch( function ( err ) {

        console.log( err );
        console.log( err.stack );

    } );
