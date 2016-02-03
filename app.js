'use strict';

const _         = require( 'lodash' );
const Registrar = require( 'kick-ioc/Registrar' );


Registrar
    .constant( 'env', {
        mode: 'development',
        paths: {
            app: __dirname + '/app'
        }
    } )
    .register(
        require( './src/App/AppProvider' ),
        require( './src/Koa/KoaProvider' ),
        require( './src/Router/RouterProvider' ),
        require( './src/Server/ServerProvider' )
    )
    .resolve( function *() {

        let server = yield this.use( 'server' );
        let app = yield this.use( 'app' );

        server.start();

        console.log( 'server.start();' );

        console.log( app.config );

    } )
    .catch( function ( err ) {

        console.log( err );
        console.log( err.stack );

    } );
